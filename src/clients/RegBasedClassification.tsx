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
import { useSketchProperties } from "@seasketch/geoprocessing/client-ui";
import {
  regBasedClassificationMetrics,
  RegBasedClassificationMetric,
} from "../helpers/mpaRegBasedClassification";
import { MpaRegSketchCollectionPanel } from "../components/MpaRegSketchCollectionPanel";
import { MpaRegSketchPanel } from "../components/MpaRegSketchPanel";
import { ZoneRegIcon } from "../components/MpaRegIcons";
import { scores } from "mpa-reg-based-classification";
import { MpaRegLearnMore } from "../components/MpaRegLearnMore";

const RegBasedClassification = () => {
  return (
    <ResultsCard title="Protection Level" functionName="area">
      {(data: ReportResult) => {
        return (
          <ReportError>
            <p>
              Based on allowed MPA activities, this plan has been assigned the
              following level of protection:
            </p>
            {isNullSketchCollection(data.sketch)
              ? collectionReport(data.sketch, data.metrics)
              : sketchReport(data.sketch)}
          </ReportError>
        );
      }}
    </ResultsCard>
  );
};

const sketchReport = (sketch: NullSketch): JSX.Element => {
  const regMetrics = regBasedClassificationMetrics(sketch);
  const sketchRegMetric = firstMatchingMetric(
    regMetrics,
    (m) => m.sketchId === sketch.properties.id
  );
  return (
    <>
      <MpaRegSketchPanel value={sketchRegMetric.value} />
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
  console.log(childAreaMetrics);
  const childAreaPercMetrics = toPercentMetric(
    childAreaMetrics,
    collAreaMetric
  );

  const regMetrics = regBasedClassificationMetrics(sketch, childAreaMetrics);
  const regChildMetrics = regMetrics.filter(
    (m) => m.sketchId !== sketch.properties.id
  );
  const collRegMetric = firstMatchingMetric(
    regMetrics,
    (m) => m.sketchId === sketch.properties.id
  );

  return (
    <>
      <MpaRegSketchCollectionPanel
        value={collRegMetric.value}
        displayName={collRegMetric.extra?.label || "Missing label"}
      />
      <Collapse title="Show by MPA">
        {genSketchTable(sketchesById, regChildMetrics, childAreaPercMetrics)}
      </Collapse>
      {genLearnMore()}
    </>
  );
};

export default RegBasedClassification;

const genLearnMore = () => (
  <Collapse title="Learn More">
    <MpaRegLearnMore />
  </Collapse>
);

const genSketchTable = (
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
