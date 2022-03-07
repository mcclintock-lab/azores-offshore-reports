import React from "react";
import {
  ResultsCard,
  ReportError,
  Collapse,
  Column,
  Table,
  SmallReportTableStyled,
} from "@seasketch/geoprocessing/client-ui";
import {
  ReportResult,
  NullSketch,
  NullSketchCollection,
  Metric,
  isNullSketchCollection,
  firstMatchingMetric,
  keyBy,
  toNullSketchArray,
  toPercentMetric,
  percentWithEdge,
} from "@seasketch/geoprocessing/client-core";
import {
  mpaClassMetrics,
  mpaClassMetric,
  RegBasedClassificationMetric,
  getProtectionLevel,
} from "../helpers/mpaRegBasedClassification";
import { scores } from "mpa-reg-based-classification";
import { RbcsMpaClassPanel } from "../components/RbcsMpaClassPanel";
import { RbcsIcon, ZoneRegIcon } from "../components/RbcsIcons";
import { RbcsLearnMore } from "../components/RbcsLearnMore";
import config from "../_config";
import { RbcsMpaObjective } from "../components/RbcsMpaObjective";
import { YES_COUNT_OBJECTIVE, NO_COUNT_OBJECTIVE } from "../types/objective";

const REPORT = config.reports.protection;
const METRIC = REPORT.metrics.areaOverlap;
const OBJECTIVES = config.objectives;

const ProtectionCard = () => {
  return (
    <ResultsCard title="Protection Level" functionName="area">
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
  const sketchMetric = firstMatchingMetric(
    metrics,
    (m) => m.sketchId === sketch.properties.id
  );
  const sketchRegMetric = mpaClassMetric(sketch, sketchMetric);
  const level = getProtectionLevel(sketchRegMetric.value);

  /** Custom msg render for eez objective */
  const renderEezMsg = () => {
    if (OBJECTIVES.eez.countsToward[level] === YES_COUNT_OBJECTIVE) {
      return (
        <>
          This MPA counts towards protecting{" "}
          <b>{percentWithEdge(OBJECTIVES.eez.target)}</b> of Azorean waters.
        </>
      );
    } else if (OBJECTIVES.eez.countsToward[level] === NO_COUNT_OBJECTIVE) {
      return (
        <>
          This MPA <b>does not</b> count towards protecting{" "}
          <b>{percentWithEdge(OBJECTIVES.eez.target)}</b> of Azorean waters.
        </>
      );
    } else {
      return (
        <>
          This MPA <b>may</b> count towards protecting{" "}
          <b>{percentWithEdge(OBJECTIVES.eez.target)}</b> of Azorean waters.
        </>
      );
    }
  };

  /** Custom msg render for eez no-take objective */
  const renderEezNoTakeMsg = () => {
    if (OBJECTIVES.eezNoTake.countsToward[level] === YES_COUNT_OBJECTIVE) {
      return (
        <>
          This MPA counts towards fully protecting{" "}
          <b>{percentWithEdge(OBJECTIVES.eezNoTake.target)}</b> of Azorean
          waters as no-take.
        </>
      );
    } else if (
      OBJECTIVES.eezNoTake.countsToward[level] === NO_COUNT_OBJECTIVE
    ) {
      return (
        <>
          This MPA <b>does not</b> count towards fully protecting{" "}
          <b>{percentWithEdge(OBJECTIVES.eezNoTake.target)}</b> of Azorean
          waters as no-take.
        </>
      );
    } else {
      return (
        <>
          This MPA <b>may</b> count towards fully protecting{" "}
          <b>{percentWithEdge(OBJECTIVES.eezNoTake.target)}</b> of Azorean
          waters as no-take.
        </>
      );
    }
  };

  return (
    <>
      <p>Based on allowed activities, this MPA scores as a:</p>
      <RbcsMpaClassPanel
        value={sketchRegMetric.value}
        displayName={sketchRegMetric.extra?.label || "Missing label"}
      />
      <RbcsMpaObjective
        level={getProtectionLevel(sketchRegMetric.value)}
        objective={OBJECTIVES.eez}
        renderMsg={renderEezMsg}
      />
      <RbcsMpaObjective
        level={getProtectionLevel(sketchRegMetric.value)}
        objective={OBJECTIVES.eezNoTake}
        renderMsg={renderEezNoTakeMsg}
      />
      {genLearnMore()}
    </>
  );
};

const collectionReport = (sketch: NullSketchCollection, metrics: Metric[]) => {
  const sketches = toNullSketchArray(sketch);
  const sketchesById = keyBy(sketches, (sk) => sk.properties.id);
  const collAreaMetric = metrics.filter(
    (m) => m.sketchId === sketch.properties.id
  );
  const childAreaMetrics = metrics.filter(
    (m) => m.sketchId !== sketch.properties.id
  );
  const childAreaPercMetrics = toPercentMetric(
    childAreaMetrics,
    collAreaMetric
  );

  const regMetrics = mpaClassMetrics(sketch, childAreaMetrics);
  const regChildMetrics = regMetrics.filter(
    (m) => m.sketchId !== sketch.properties.id
  );

  return (
    <>
      {genMpaSketchTable(sketchesById, regChildMetrics)}
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
      Header: " ",
      accessor: (row) => {
        return <RbcsIcon value={row.value} />;
      },
    },
    {
      Header: "Protection Level",
      accessor: (row) => row.extra?.label,
    },
    {
      Header: "MPA",
      accessor: (row) => sketchesById[row.sketchId].properties.name,
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
