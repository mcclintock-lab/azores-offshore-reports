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
} from "@seasketch/geoprocessing/client-core";
import {
  mpaClassMetrics,
  mpaClassMetric,
  RegBasedClassificationMetric,
  getMpaClassificationName,
} from "../helpers/mpaRegBasedClassification";
import { scores } from "mpa-reg-based-classification";
import { RbcsMpaClassPanel } from "../components/RbcsMpaClassPanel";
import { RbcsIcon, ZoneRegIcon } from "../components/RbcsIcons";
import { RbcsLearnMore } from "../components/RbcsLearnMore";
import { AzoresMpaObjectives } from "../components/AzoresMpaObjectives";
import {
  isRbcsProtectionLevel,
  OBJECTIVE_NO,
  OBJECTIVE_YES,
  RbcsMpaProtectionLevel,
  rbcsMpaProtectionLevels,
} from "../types/objective";

import config from "../_config";

import protectionTotals from "../../data/precalc/protectionTotals.json";
import { RbcsZoneClassPanel } from "../components/RbcsZoneClassPanel";
import { AzoresNetworkObjectiveStatus } from "../components/AzoresNetworkObjectives";
import { getKeys } from "../helpers/ts";
import { HorizontalStackedBar } from "../components/HorizontalStackedBar";
import { ChartLegend } from "../components/ChartLegend";
const precalcTotals = protectionTotals as ReportResultBase;

const REPORT = config.reports.protection;
const METRIC = REPORT.metrics.areaOverlap;
const OBJECTIVES = config.objectives;

import styled from "styled-components";

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
      <div style={{ display: "flex", alignItems: "center" }}>
        <span style={{ paddingBottom: 10, width: 60 }}>Zone:</span>
        <RbcsZoneClassPanel value={sketchRegZoneMetric.value} />
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <span style={{ paddingBottom: 10, width: 60 }}>MPA:</span>
        <RbcsMpaClassPanel
          value={sketchRegMpaMetric.value}
          displayName={sketchRegMpaMetric.extra?.label || "Missing label"}
          displayValue={false}
        />
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

  const chart1Config = {
    rows: [totalsByObjective["eez"].map((value) => [value * 100])],
    rowConfigs: [
      {
        title: "30% of EEZ",
      },
    ],
    target: OBJECTIVES["eez"].target * 100,
    max: 100,
  };

  const chart2Config = {
    rows: [totalsByObjective["eezNoTake"].map((value) => [value * 100])],
    rowConfigs: [
      {
        title: "15% of EEZ as no-take",
      },
    ],
    target: OBJECTIVES["eezNoTake"].target * 100,
    max: 100,
  };

  const blueColors = ["#4292c6", "#6baed6", "#9ecae1", "#c6dbef", "#eff3ff"];
  const blockGroupNames = ["Fully Protected", "Highly Protected"];
  const blockGroupStyles = blueColors.map((curBlue) => ({
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
      <AzoresNetworkObjectiveStatus
        objective={OBJECTIVES.eez}
        objectiveMet={eezMet}
      />
      <HorizontalStackedBar
        {...chart1Config}
        blockGroupNames={blockGroupNames}
        blockGroupStyles={blockGroupStyles}
        showLegend={false}
        showTitle={false}
        valueFormatter={valueFormatter}
      />
      <AzoresNetworkObjectiveStatus
        objective={OBJECTIVES.eezNoTake}
        objectiveMet={eezNoTakeMet}
      />
      <HorizontalStackedBar
        {...chart2Config}
        blockGroupNames={blockGroupNames}
        blockGroupStyles={blockGroupStyles}
        showLegend={false}
        showTitle={false}
        valueFormatter={valueFormatter}
      />

      <ChartLegend
        blockGroupNames={blockGroupNames}
        blockGroupStyles={blockGroupStyles}
      />

      {genGroupLevelTable(groupLevelAggs)}

      <Collapse title="Show by MPA">
        {genMpaSketchTable(sketchesById, regChildMetrics)}
      </Collapse>
      {genLearnMore()}
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
      Header: "Protection Level",
      accessor: (row) => row.extra?.label,
    },
    {
      Header: "Index Score",
      accessor: (row) => {
        return <RbcsIcon value={row.value} size={20} />;
      },
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
          groupColorMap={{}}
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
          <GroupPill groupColorMap={{}} group={row.groupId}>
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
