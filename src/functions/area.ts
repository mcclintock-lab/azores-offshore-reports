import {
  area as sketchArea,
  rekeyMetrics,
  sortMetrics,
  toNullSketch,
  Sketch,
  SketchCollection,
  GeoprocessingHandler,
  Polygon,
  ReportResult,
} from "@seasketch/geoprocessing";

export async function area(
  sketch: Sketch<Polygon> | SketchCollection<Polygon>
): Promise<ReportResult> {
  const areaMetrics = await sketchArea(sketch, { includeChildMetrics: true });

  return {
    metrics: rekeyMetrics(sortMetrics(areaMetrics)),
    sketch: toNullSketch(sketch),
  };
}

export default new GeoprocessingHandler(area, {
  title: "area",
  description: "returns area metrics for sketch",
  timeout: 60, // seconds
  executionMode: "async",
  // Specify any Sketch Class form attributes that are required
  requiresProperties: [],
  memory: 2048,
});
