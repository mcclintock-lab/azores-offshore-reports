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
import { AzoresMpaObjectives } from "../components/AzoresMpaObjectives";
import config from "../_config";

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

  return (
    <>
      <p>Based on allowed activities, this MPA scores as a:</p>
      <RbcsMpaClassPanel
        value={sketchRegMetric.value}
        displayName={sketchRegMetric.extra?.label || "Missing label"}
      />
      <AzoresMpaObjectives objectives={OBJECTIVES} level={level} />

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
