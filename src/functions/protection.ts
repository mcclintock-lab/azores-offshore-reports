import {
  rekeyMetrics,
  sortMetrics,
  toNullSketch,
  Sketch,
  SketchCollection,
  GeoprocessingHandler,
  Polygon,
  ReportResult,
  Metric,
  overlapAreaGroupMetrics,
  overlapArea,
  getSketchToMpaProtectionLevel,
  rbcsMpaProtectionLevels,
} from "@seasketch/geoprocessing";
import config, { STUDY_REGION_AREA_SQ_METERS } from "../_config";

const CONFIG = config;
const REPORT = CONFIG.reports.protection;
const METRIC = REPORT.metrics.areaOverlap;
const CLASS = METRIC.classes[0];
if (!CONFIG || !REPORT || !METRIC)
  throw new Error("Problem accessing report config");

export async function protection(
  sketch: Sketch<Polygon> | SketchCollection<Polygon>
): Promise<ReportResult> {
  // Generate area metrics with overlap removed, then add class ID
  const areaMetrics = (
    await overlapArea(METRIC.metricId, sketch, STUDY_REGION_AREA_SQ_METERS, {
      includePercMetric: false,
    })
  ).map(
    (metrics): Metric => ({
      ...metrics,
      classId: CLASS.classId,
    })
  );

  // Generate area metrics grouped by protection level, with area overlap within protection level removed
  // Each sketch gets one group metric for its protection level, while collection generates one for each protection level
  const sketchToMpaClass = getSketchToMpaProtectionLevel(sketch, areaMetrics);
  const metricToLevel = (sketchMetric: Metric) => {
    return sketchToMpaClass[sketchMetric.sketchId!];
  };

  const levelMetrics = await overlapAreaGroupMetrics({
    metricId: METRIC.metricId,
    groupIds: Array.from(rbcsMpaProtectionLevels),
    sketch,
    metricToGroup: metricToLevel,
    metrics: areaMetrics,
    classId: CLASS.classId,
    outerArea: STUDY_REGION_AREA_SQ_METERS,
  });

  return {
    metrics: sortMetrics(rekeyMetrics([...areaMetrics, ...levelMetrics])),
    sketch: toNullSketch(sketch),
  };
}

export default new GeoprocessingHandler(protection, {
  title: "protection",
  description: "returns area metrics for protection levels for sketch",
  timeout: 60, // seconds
  executionMode: "async",
  // Specify any Sketch Class form attributes that are required
  requiresProperties: [],
  memory: 4096,
});
