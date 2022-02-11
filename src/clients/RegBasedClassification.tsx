import React from "react";
import {
  ResultsCard,
  ReportError,
  useSketchProperties
} from "@seasketch/geoprocessing/client-ui";
import { getJsonUserAttribute, getUserAttribute, ReportResult, NullSketch, NullSketchCollection, Metric, keyBy } from "@seasketch/geoprocessing/client-core";
import { classifyMPA, classifyZone, constants, MpaClassification, Zone } from "mpa-reg-based-classification"
import { isSketchCollection, Polygon } from "@seasketch/geoprocessing";

const Number = new Intl.NumberFormat("en", { style: "decimal" });

const RegBasedClassification = () => {  
  const [ { isCollection } ] = useSketchProperties()
  return (
    <ResultsCard title="Zone Classification" functionName="area">
    {(data: ReportResult) => {      
      const report = isCollection ? collectionReport(data.sketch as NullSketchCollection, data.metrics) : sketchReport(data.sketch as NullSketch)
      return (
        <ReportError>
          {report}
        </ReportError>
      );
    }}
  </ResultsCard>
  );
};

const sketchReport = (sketch: NullSketch): JSX.Element => {
  const gearTypes = getJsonUserAttribute<string[]>(sketch.properties, "GEAR_TYPES", [])
  const boating = getUserAttribute<string>(sketch.properties, "BOATING", "")
  const aquaculture = getUserAttribute<string>(sketch.properties, "AQUACULTURE", "")
  const gearTypesMapped = gearTypes.map(gt => constants.GEAR_TYPES[gt])
  const boatingMapped = constants.BOATING_AND_ANCHORING[boating]
  const aquacultureMapped = constants.AQUACULTURE_AND_BOTTOM_EXPLOITATION[aquaculture]

  return (
    <>
      <div>{gearTypes.join()}</div>
      <div>{boating}</div>
      <div>{aquaculture}</div>
      <div>Score: {classifyZone(gearTypesMapped, aquacultureMapped, boatingMapped)}</div>
    </>
  )
}

const collectionReport = (sketch: NullSketchCollection, metrics: Metric[] ) => {  

  const childMetrics = metrics.filter(m => m.sketchId !== sketch.properties.id)
  const areaBySketch = keyBy(childMetrics, m => m.sketchId!)
  
  const sketchZones: Zone[] = sketch.features.map(sk => {
    const gearTypes = getJsonUserAttribute<string[]>(sk.properties, "GEAR_TYPES", [])
    const boating = getUserAttribute<string>(sk.properties, "BOATING", "")
    const aquaculture = getUserAttribute<string>(sk.properties, "AQUACULTURE", "")
    const gearTypesMapped = gearTypes.map(gt => constants.GEAR_TYPES[gt])
    const boatingMapped = constants.BOATING_AND_ANCHORING[boating]
    const aquacultureMapped = constants.AQUACULTURE_AND_BOTTOM_EXPLOITATION[aquaculture]
    const sketchArea = areaBySketch[sk.properties.id].value
    return [gearTypesMapped, aquacultureMapped, boatingMapped, sketchArea]
  })
  const collectionResult: MpaClassification = classifyMPA(sketchZones)

  return (
    <>
      <div>Zone Scores: {collectionResult.scores.join(',')}</div>
      <div>Collection score: {Math.round(collectionResult.index)}</div>
      <div>{collectionResult.indexLabel}</div>
    </>
  )  
}

export default RegBasedClassification;
