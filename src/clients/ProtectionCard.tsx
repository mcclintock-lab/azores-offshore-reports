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
  HorizontalStackedBar,
  HorizontalStackedBarRow,
  RbcsMpaClassPanel,
  RbcsZoneRegIcon,
  PointyCircle,
  RbcsLearnMore,
  RbcsZoneClassPanel,
  ReportChartFigure,
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
  mpaClassMetrics,
  mpaClassMetric,
  RegBasedClassificationMetric,
  getMpaClassificationName,
  rbcsScores,
  isRbcsProtectionLevel,
  OBJECTIVE_NO,
  OBJECTIVE_YES,
  RbcsMpaProtectionLevel,
  rbcsMpaProtectionLevels,
  getKeys,
} from "@seasketch/geoprocessing/client-core";
import { AzoresMpaObjectives } from "../components/AzoresMpaObjectives";
import { AzoresNetworkObjectiveStatus } from "../components/AzoresNetworkObjectives";
import styled from "styled-components";

import protectionTotals from "../../data/precalc/protectionTotals.json";
import config from "../_config";

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

export const SmallReportTableStyled = styled(ReportTableStyled)`
  .styled {
    font-size: 13px;
  }
`;

const ProtectionCard = () => {
  return (
    <ResultsCard title="Protection Level" functionName="protection">
      {(data: ReportResult) => {
        return (
          <ReportError>
            {isNullSketchCollection(data.sketch)
              ? collectionReport(data.sketch, data.metrics)
              : sketchReport(data.sketch, data.metrics)}
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
      <p>This MPA is classified by its allowed actitivities as follows:</p>
      <div style={{ padding: 10, border: "1px dotted #aaa", borderRadius: 10 }}>
        <div
          style={{
            padding: "0px 10px 10px 10px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <span style={{ width: 60 }}>MPA:</span>
          <RbcsMpaClassPanel
            value={sketchRegMpaMetric.value}
            size={18}
            displayName={sketchRegMpaMetric.extra?.label || "Missing label"}
            displayValue={false}
            group={sketchRegMpaMetric.extra?.label}
            groupColorMap={groupColorMap}
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            border: "1px dotted #ddd",
            borderRadius: 10,
            padding: 10,
          }}
        >
          <span style={{ width: 60 }}>Zone:</span>
          <RbcsZoneClassPanel value={sketchRegZoneMetric.value} size={18} />
        </div>
      </div>
      <p>Based on those assigned classifications:</p>
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
  const regMetrics = mpaClassMetrics(sketch, childAreaMetrics);
  const regChildMetrics = regMetrics.filter(
    (m) => m.sketchId !== sketch.properties.id
  );

  return (
    <>
      <p>
        MPAs group into protection levels based on their allowed activities as
        follows:
      </p>
      <ReportChartFigure>
        <HorizontalStackedBar
          {...chartAllConfig}
          blockGroupNames={blockGroupNames}
          blockGroupStyles={blockGroupStyles}
          showLegend={true}
          showTitle={true}
          valueFormatter={valueFormatter}
        />

        <p></p>
      </ReportChartFigure>
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
        {genMpaSketchTable(sketchesById, regChildMetrics)}
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
  regMetrics: RegBasedClassificationMetric[]
) => {
  const columns: Column<RegBasedClassificationMetric>[] = [
    {
      Header: "MPA",
      accessor: (row) => sketchesById[row.sketchId].properties.name,
    },
    {
      Header: "Index Score",
      accessor: (row) => {
        return (
          <PointyCircle
            color={
              row.extra?.label ? groupColorMap[row.extra.label] : undefined
            }
          >
            {row.value}
          </PointyCircle>
        );
      },
    },
    {
      Header: "Protection Level",
      accessor: (row) => row.extra?.label,
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
        return <RbcsZoneRegIcon value={row.value} />;
      },
    },
    {
      Header: "Zone Classification",
      accessor: (row) => rbcsScores[row.value].label,
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
