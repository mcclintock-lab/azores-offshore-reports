import React from "react";
import { ResultsCard, ReportError } from "@seasketch/geoprocessing/client-ui";
import {
  ReportResult,
  NullSketch,
  NullSketchCollection,
  Metric,
  isNullSketchCollection,
  firstMatchingMetric,
} from "@seasketch/geoprocessing/client-core";
import { scores } from "mpa-reg-based-classification";
import { PointyCircle, TwoColorPointyCircle } from "../components/PointyCircle";
import { regBasedClassificationMetrics } from "../helpers/mpaRegBasedClassification";

const RegBasedClassification = () => {
  return (
    <ResultsCard title="Zone Classification" functionName="area">
      {(data: ReportResult) => {
        const report = isNullSketchCollection(data.sketch)
          ? collectionReport(data.sketch, data.metrics)
          : sketchReport(data.sketch);
        return <ReportError>{report}</ReportError>;
      }}
    </ResultsCard>
  );
};

const sketchReport = (sketch: NullSketch): JSX.Element => {
  const regMetrics = regBasedClassificationMetrics(sketch);
  console.log(regMetrics);
  const sketchRegMetric = firstMatchingMetric(
    regMetrics,
    (m) => m.sketchId === sketch.properties.id
  );
  return (
    <>
      <PointyCircle size={20} color={scores[sketchRegMetric.value].color}>
        {sketchRegMetric.value}
      </PointyCircle>
    </>
  );
};

const collectionReport = (sketch: NullSketchCollection, metrics: Metric[]) => {
  const childMetrics = metrics.filter(
    (m) => m.sketchId !== sketch.properties.id
  );
  const regMetrics = regBasedClassificationMetrics(sketch, childMetrics);
  console.log(regMetrics);
  const collRegMetric = firstMatchingMetric(
    regMetrics,
    (m) => m.sketchId === sketch.properties.id
  );

  return (
    <>
      <TwoColorPointyCircle
        size={30}
        bottomColor={scores[Math.floor(collRegMetric.value)].color}
        topColor={scores[Math.ceil(collRegMetric.value)].color}
        perc={35}
      >
        {Math.round(collRegMetric.value * 10) / 10}
      </TwoColorPointyCircle>
    </>
  );
};

export default RegBasedClassification;
