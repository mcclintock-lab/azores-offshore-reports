import {
  getJsonUserAttribute,
  getUserAttribute,
  NullSketch,
  NullSketchCollection,
  Metric,
  keyBy,
  isSketchCollection,
  isNullSketchCollection,
  toNullSketchArray,
  createMetric,
} from "@seasketch/geoprocessing/client-core";
import {
  classifyMPA,
  constants,
  MpaClassification,
  Zone,
} from "mpa-reg-based-classification";

/**
 * Extended metric for mpa-reg-based-classification results
 */
export interface RegBasedClassificationMetric extends Omit<Metric, "extra"> {
  sketchId: string;
  extra?: {
    gearTypes?: string[];
    aquaculture?: string;
    boating?: string;
  };
}

/**
 * Given sketch with reg userAttributes, returns metrics with classification
 * score as value Collection metric will have combined score index as value
 * @param sketch - sketch or sketch collection with GEAR_TYPES (multi),
 * BOATING (single), and AQUACULTURE (single) user attributes
 * @param childMetrics - area metrics for sketches
 */
export function regBasedClassificationMetrics(
  sketch: NullSketchCollection | NullSketch,
  childAreaMetrics?: Metric[]
): RegBasedClassificationMetric[] {
  const areaBySketch = keyBy(childAreaMetrics || [], (m) => m.sketchId!);
  const sketches = toNullSketchArray(sketch);

  // Extract user attributes from sketch and classify
  const sketchZones: Zone[] = sketches.map((sk) => {
    const gearTypes = getJsonUserAttribute<string[]>(
      sk.properties,
      "GEAR_TYPES",
      []
    );
    const boating = getUserAttribute<string>(sk.properties, "BOATING", "");
    const aquaculture = getUserAttribute<string>(
      sk.properties,
      "AQUACULTURE",
      ""
    );
    const gearTypesMapped = gearTypes.map((gt) => constants.GEAR_TYPES[gt]);
    const boatingMapped = constants.BOATING_AND_ANCHORING[boating];
    const aquacultureMapped =
      constants.AQUACULTURE_AND_BOTTOM_EXPLOITATION[aquaculture];
    const sketchArea = areaBySketch[sk.properties.id]?.value || 10; // make up area for single sketch since unused anyway
    return [gearTypesMapped, aquacultureMapped, boatingMapped, sketchArea];
  });
  const collectionResult: MpaClassification = classifyMPA(sketchZones);

  // Transform result to metrics
  const metrics: RegBasedClassificationMetric[] = collectionResult.scores.map(
    (score, index) => ({
      ...createMetric({ value: score }),
      metricId: "regBasedClass",
      sketchId: sketches[index].properties.id,
      value: score,
      extra: {
        gearTypes: sketchZones[index][0],
        aquaculture: sketchZones[index][1],
        boating: sketchZones[index][2],
      },
    })
  );

  if (isSketchCollection(sketch) || isNullSketchCollection(sketch)) {
    metrics.push({
      ...createMetric({ value: collectionResult.index }),
      metricId: "regBasedClass",
      sketchId: sketch.properties.id,
    });
  }

  return metrics;
}
