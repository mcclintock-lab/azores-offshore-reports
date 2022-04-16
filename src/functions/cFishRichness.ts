import {
  GeoprocessingHandler,
  Metric,
  Polygon,
  ReportResult,
  Sketch,
  SketchCollection,
  toSketchArray,
  toNullSketch,
  overlapRasterClass,
  rekeyMetrics,
  sortMetrics,
  classIdMapping,
} from "@seasketch/geoprocessing";
import { loadCogWindow } from "@seasketch/geoprocessing/dataproviders";
import bbox from "@turf/bbox";
import config from "../_config";

const METRIC = config.metricGroups.cFishRichGroups.cFishRichValueOverlap;

export async function habitatProtection(
  sketch: Sketch<Polygon> | SketchCollection<Polygon>
): Promise<ReportResult> {
  const box = sketch.bbox || bbox(sketch);

  // Categorical raster - multi-class
  const raster = await loadCogWindow(
    `${config.dataBucketUrl}${METRIC.filename}`,
    { windowBox: box }
  );
  const metrics: Metric[] = (
    await overlapRasterClass(
      METRIC.metricId,
      raster,
      sketch,
      classIdMapping(METRIC.classes)
    )
  ).map((metrics) => ({
    ...metrics,
  }));

  return {
    metrics: sortMetrics(rekeyMetrics(metrics)),
    sketch: toNullSketch(sketch, true),
  };
}

export default new GeoprocessingHandler(habitatProtection, {
  title: "cFishRichness",
  description: "species richness overlap metrics",
  timeout: 240, // seconds
  executionMode: "async",
  // Specify any Sketch Class form attributes that are required
  requiresProperties: [],
  memory: 4096,
});
