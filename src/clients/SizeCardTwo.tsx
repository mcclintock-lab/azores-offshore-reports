import React from "react";
import {
  ResultsCard,
  ReportError,
  Collapse,
  Column,
  Table,
  ReportTableStyled,
  GroupCircleRow,
  GroupPill,
  KeySection,
  LayerToggle,
  HorizontalStackedBar,
  HorizontalStackedBarRow,
} from "@seasketch/geoprocessing/client-ui";
import {
  ReportResult,
  ReportResultBase,
  NullSketch,
  NullSketchCollection,
  Metric,
  isNullSketchCollection,
  firstMatchingMetric,
  keyBy,
  toNullSketchArray,
  percentWithEdge,
  flattenByGroupAllClass,
  GroupMetricAgg,
  capitalize,
  roundLower,
  squareMeterToKilometer,
  toPercentMetric,
} from "@seasketch/geoprocessing/client-core";
import {
  mpaClassMetrics,
  mpaClassMetric,
  RegBasedClassificationMetric,
  getMpaClassificationName,
} from "../helpers/mpaRegBasedClassification";
import { scores } from "mpa-reg-based-classification";
import { ZoneRegIcon } from "../components/RbcsIcons";
import { PointyCircle } from "../components/PointyCircle";
import { RbcsLearnMore } from "../components/RbcsLearnMore";
import { AzoresMpaObjectives } from "../components/AzoresMpaObjectives";
import {
  isRbcsProtectionLevel,
  OBJECTIVE_NO,
  OBJECTIVE_YES,
  RbcsMpaProtectionLevel,
  rbcsMpaProtectionLevels,
} from "../types/objective";

import config, { STUDY_REGION_AREA_SQ_METERS } from "../_config";

import protectionTotals from "../../data/precalc/protectionTotals.json";
import { AzoresNetworkObjectiveStatus } from "../components/AzoresNetworkObjectives";
import { getKeys } from "../helpers/ts";
const precalcTotals = protectionTotals as ReportResultBase;

const REPORT = config.reports.protection;
const METRIC = REPORT.metrics.areaOverlap;
const OBJECTIVES = config.objectives;

const groupColorMap: Record<string, string> = {
  "Fully Protected Area": "#BEE4BE",
  "Highly Protected Area": "#FFE1A3",
  "Moderately Protected Area": "#F7A6B4",
  "Poorly Protected Area": "#ccc",
  "Unprotected Area": "#ccc",
};

import styled from "styled-components";
import { ReportChartFigure } from "../components/ReportChartFigure";

export const SmallReportTableStyled = styled(ReportTableStyled)`
  .styled {
    font-size: 13px;
  }
`;

const ProtectionCard = () => {
  return (
    <ResultsCard title="Size" functionName="protection">
      {(data: ReportResult) => {
        // Grab overall size metric
        const areaMetric = firstMatchingMetric(
          data.metrics,
          (m) => m.sketchId === data.sketch.properties.id && m.groupId === null
        );

        const areaDisplay = roundLower(
          squareMeterToKilometer(areaMetric.value)
        );
        const percArea = areaMetric.value / STUDY_REGION_AREA_SQ_METERS;
        const percDisplay = percentWithEdge(percArea);
        const areaUnitDisplay = "sq. km";

        return (
          <ReportError>
            <>
              <KeySection>
                This plan is{" "}
                <b>
                  {areaDisplay} {areaUnitDisplay}
                </b>
                , which is <b>{percDisplay}</b> of the Azores Exclusive Economic
                Zone (EEZ).
              </KeySection>
              <LayerToggle
                label="View EEZ Boundary"
                layerId="61893947da2f4b683bb7318e"
              />
              <br />
              {isNullSketchCollection(data.sketch)
                ? collectionReport(data.sketch, data.metrics)
                : sketchReport(data.sketch, data.metrics)}
            </>
          </ReportError>
        );
      }}
    </ResultsCard>
  );
};

/**
 * Report protection level for sketch as rbcs MPA with single zone
 */
const sketchReport = (sketch: NullSketch, metrics: Metric[]) => {
  // Get non-group metric
  const sketchMetric = firstMatchingMetric(
    metrics,
    (m) => !m.groupId && m.sketchId === sketch.properties.id
  );

  const sketchRegMetrics = mpaClassMetric(sketch, sketchMetric);
  const sketchRegZoneMetric = firstMatchingMetric(
    sketchRegMetrics,
    (m) => m.metricId === "rbcs" && m.classId === "zone"
  );
  const sketchRegMpaMetric = firstMatchingMetric(
    sketchRegMetrics,
    (m) => m.metricId === "rbcs" && m.classId === "mpa"
  );

  const mpaClassificationName = getMpaClassificationName(
    sketchRegMpaMetric.value
  );

  return (
    <>
      <AzoresMpaObjectives
        objectives={OBJECTIVES}
        level={mpaClassificationName}
      />

      {genLearnMore()}
    </>
  );
};

const collectionReport = (sketch: NullSketchCollection, metrics: Metric[]) => {
  const sketches = toNullSketchArray(sketch);
  const sketchesById = keyBy(sketches, (sk) => sk.properties.id);

  const levelMetrics = metrics.filter(
    (m) =>
      m.groupId &&
      isRbcsProtectionLevel(m.groupId) &&
      rbcsMpaProtectionLevels.includes(m.groupId)
  );

  // Objective status

  const groupLevelAggs: GroupMetricAgg[] = flattenByGroupAllClass(
    sketch,
    levelMetrics,
    precalcTotals.metrics
  );

  const totalsByObjective = getKeys(OBJECTIVES).reduce<
    Record<string, number[]>
  >((acc, objectiveId) => {
    // filter the group level aggs that are yes for this objective
    const yesAggs: GroupMetricAgg[] = groupLevelAggs.filter((levelAgg) => {
      const level = levelAgg.groupId as RbcsMpaProtectionLevel;
      return OBJECTIVES[objectiveId].countsToward[level] === OBJECTIVE_YES;
    });
    // Extract percent value from metric
    const yesValues = yesAggs.map((yesAgg) => yesAgg.percValue);
    return { ...acc, [objectiveId]: yesValues };
  }, {});

  const eezPercSum = totalsByObjective["eez"].reduce(
    (sumSoFar, levelTotal) => sumSoFar + levelTotal,
    0
  );
  const eezMet =
    eezPercSum >= OBJECTIVES["eez"].target ? OBJECTIVE_YES : OBJECTIVE_NO;
  const eezNoTakePercSum = totalsByObjective["eezNoTake"].reduce(
    (sumSoFar, levelTotal) => sumSoFar + levelTotal,
    0
  );
  const eezNoTakeMet =
    eezNoTakePercSum >= OBJECTIVES["eezNoTake"].target
      ? OBJECTIVE_YES
      : OBJECTIVE_NO;

  // Objective charts

  // Convert to row of block roups and filter out zero values so they don't show up in the legend
  const rowBlocks: HorizontalStackedBarRow = groupLevelAggs.reduce<
    Array<Array<number>>
  >((blockSoFar, agg) => {
    if (agg.percValue > 0) {
      return [...blockSoFar, [agg.percValue * 100]];
    } else {
      return blockSoFar;
    }
  }, []);

  const chartAllConfig = {
    rows: [rowBlocks],
    rowConfigs: [
      {
        title: "% EEZ",
      },
    ],
    max: 100,
  };

  const chart1Config = {
    rows: [totalsByObjective["eez"].map((value) => [value * 100])],
    rowConfigs: [
      {
        title: "",
      },
    ],
    target: OBJECTIVES["eez"].target * 100,
    max: 100,
  };

  const chart2Config = {
    rows: [totalsByObjective["eezNoTake"].map((value) => [value * 100])],
    rowConfigs: [
      {
        title: "",
      },
    ],
    target: OBJECTIVES["eezNoTake"].target * 100,
    max: 100,
  };

  const groupColors = Object.values(groupColorMap);
  const blockGroupNames = ["Full", "High", "Moderate", "Poor", "Unprotected"];
  const blockGroupStyles = groupColors.map((curBlue) => ({
    backgroundColor: curBlue,
  }));
  const valueFormatter = (value: number) => percentWithEdge(value / 100);

  // Child sketch table

  const childAreaMetrics = metrics.filter(
    (m) => m.sketchId !== sketch.properties.id
  );

  const childAreaPercMetrics = toPercentMetric(
    childAreaMetrics,
    precalcTotals.metrics
  );

  const regMetrics = mpaClassMetrics(sketch, childAreaMetrics);
  const regChildMetrics = regMetrics.filter(
    (m) => m.sketchId !== sketch.properties.id
  );

  return (
    <>
      <AzoresNetworkObjectiveStatus
        objective={OBJECTIVES.eez}
        objectiveMet={eezMet}
      />
      <ReportChartFigure>
        <HorizontalStackedBar
          {...chart1Config}
          blockGroupNames={blockGroupNames}
          blockGroupStyles={blockGroupStyles}
          showLegend={false}
          valueFormatter={valueFormatter}
        />
      </ReportChartFigure>
      <AzoresNetworkObjectiveStatus
        objective={OBJECTIVES.eezNoTake}
        objectiveMet={eezNoTakeMet}
      />
      <ReportChartFigure>
        <HorizontalStackedBar
          {...chart2Config}
          blockGroupNames={blockGroupNames}
          blockGroupStyles={blockGroupStyles}
          showLegend={false}
          valueFormatter={valueFormatter}
        />
      </ReportChartFigure>

      {genLearnMore()}
      <Collapse title="Show by Protection Level">
        {genGroupLevelTable(groupLevelAggs)}
      </Collapse>

      <Collapse title="Show by MPA">
        {genMpaSketchTable(sketchesById, childAreaPercMetrics)}
      </Collapse>
    </>
  );
};

export default ProtectionCard;

const genLearnMore = () => (
  <Collapse title="Learn More">
    <RbcsLearnMore objectives={OBJECTIVES} />
  </Collapse>
);

const genMpaSketchTable = (
  sketchesById: Record<string, NullSketch>,
  regMetrics: Metric[]
) => {
  const columns: Column<Metric>[] = [
    {
      Header: "MPA",
      accessor: (row) => sketchesById[row.sketchId!].properties.name,
    },
    {
      Header: "% EEZ",
      accessor: (row) => percentWithEdge(row.value),
    },
  ];

  return (
    <SmallReportTableStyled>
      <Table
        className="styled"
        columns={columns}
        data={regMetrics.sort((a, b) => {
          return a.value > b.value ? 1 : -1;
        })}
      />
    </SmallReportTableStyled>
  );
};

const genZoneSketchTable = (
  sketchesById: Record<string, NullSketch>,
  regMetrics: RegBasedClassificationMetric[],
  areaPercMetrics: Metric[]
) => {
  const columns: Column<RegBasedClassificationMetric>[] = [
    {
      Header: " ",
      accessor: (row) => {
        return <ZoneRegIcon value={row.value} />;
      },
    },
    {
      Header: "Zone Classification",
      accessor: (row) => scores[row.value].label,
    },
    {
      Header: "MPA",
      accessor: (row) => sketchesById[row.sketchId].properties.name,
    },
    {
      Header: "% Total Area",
      accessor: (row) =>
        percentWithEdge(
          firstMatchingMetric(
            areaPercMetrics,
            (m) => m.sketchId === row.sketchId
          ).value
        ),
    },
  ];

  return (
    <SmallReportTableStyled>
      <Table
        className="styled"
        columns={columns}
        data={regMetrics.sort((a, b) => {
          return a.value > b.value ? 1 : -1;
        })}
      />
    </SmallReportTableStyled>
  );
};

const genGroupLevelTable = (levelAggs: GroupMetricAgg[]) => {
  const columns: Column<GroupMetricAgg>[] = [
    {
      Header: "Based on allowed activities, this plan contains:",
      accessor: (row) => (
        <GroupCircleRow
          group={row.groupId}
          groupColorMap={groupColorMap}
          circleText={`${row.numSketches}`}
          rowText={
            <>
              <b>
                {capitalize(row.groupId)}
                {row.numSketches === 1 ? "" : "s"}
              </b>
            </>
          }
        />
      ),
    },
    {
      Header: "% EEZ",
      accessor: (row) => {
        return (
          <GroupPill groupColorMap={groupColorMap} group={row.groupId}>
            {percentWithEdge(row.percValue as number)}
          </GroupPill>
        );
      },
    },
  ];

  return (
    <SmallReportTableStyled>
      <Table
        className="styled"
        columns={columns}
        data={levelAggs.sort((a, b) => a.groupId.localeCompare(b.groupId))}
      />
    </SmallReportTableStyled>
  );
};
