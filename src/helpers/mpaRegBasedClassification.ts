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
    label?: string;
  };
}

/**
 * Returns classification name given MPA classification index value
 */
export function getClassificationLabel(index: number) {
  if (index < 3) {
    return "Fully Protected Area";
  } else if (index < 5) {
    return "Highly Protected Area";
  } else if (index < 6) {
    return "Moderately Protected Area";
  } else if (index < 7) {
    return "Poorly Protected Area";
  } else {
    return "Unprotected Area";
  }
}

/**
 * Given sketch with reg userAttributes, returns metrics with classification
 * score as value. Collection metric will have combined score index as value
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
      extra: {
        label: collectionResult.indexLabel,
      },
    });
  }

  return metrics;
}

/**
 * Returns percent protection given index value,
 * percent is proportion (percent) of bottom color to top color to use for icon given index value (as shown in paper)
 * e.g. index = 5.4 means bottom icon color should take 25% of icon and top color 75%
 * @param index - classification index value for sketch collection
 */
export function getIndexIconPerc(index: number) {
  if (index < 3) {
    return 100;
  } else if (index < 5) {
    return 75;
  } else if (index < 6) {
    return 50;
  } else if (index < 7) {
    return 25;
  } else {
    return 0;
  }
}
