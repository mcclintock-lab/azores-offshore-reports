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
  RegBasedClassificationMetric,
} from "../helpers/mpaRegBasedClassification";
import { scores } from "mpa-reg-based-classification";
import { RbcsMpaClassPanel } from "../components/RbcsMpaClassPanel";
import { RbcsIcon, ZoneRegIcon } from "../components/RbcsIcons";
import { RbcsLearnMore } from "../components/RbcsLearnMore";

const ProtectionCard = () => {
  return (
    <ResultsCard title="Protection Level" functionName="area">
      {(data: ReportResult) => {
        return (
          <ReportError>
            <p>
              MPAs in this plan have been assigned the following proteBased on
              allowed MPA activities, this plan has been assigned the following
              level of protection:
            </p>
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
  const sketchMetrics = metrics.filter(
    (m) => m.sketchId === sketch.properties.id
  );

  const sketchRegMetrics = mpaClassMetrics(sketch, sketchMetrics);
  const sketchRegMetric = firstMatchingMetric(
    sketchRegMetrics,
    (m) => m.sketchId === sketch.properties.id
  );
  console.log("sketchRegMetric", sketchRegMetric);

  return (
    <>
      <RbcsMpaClassPanel
        value={sketchRegMetric.value}
        displayName={sketchRegMetric.extra?.label || "Missing label"}
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
      {genMpaSketchTable(sketchesById, regChildMetrics, childAreaPercMetrics)}
      {genLearnMore()}
    </>
  );
};

export default ProtectionCard;

const genLearnMore = () => (
  <Collapse title="Learn More">
    <RbcsLearnMore />
  </Collapse>
);

const genMpaSketchTable = (
  sketchesById: Record<string, NullSketch>,
  regMetrics: RegBasedClassificationMetric[],
  areaPercMetrics: Metric[]
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
