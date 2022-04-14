import {
  GeoprocessingHandler,
  Metric,
  Polygon,
  ReportResult,
  Sketch,
  SketchCollection,
  toSketchArray,
  toNullSketch,
  overlapRaster,
  rekeyMetrics,
  sortMetrics,
} from "@seasketch/geoprocessing";
import { loadCogWindow } from "@seasketch/geoprocessing/dataproviders";
import bbox from "@turf/bbox";
import config from "../_config";

const METRIC = config.metricGroups.essentialHabitatGroups.essentialValueOverlap;

export async function habitatProtection(
  sketch: Sketch<Polygon> | SketchCollection<Polygon>
): Promise<ReportResult> {
  const sketches = toSketchArray(sketch);
  const box = sketch.bbox || bbox(sketch);

  // Individual rasters - single-class
  const metrics: Metric[] = (
    await Promise.all(
      METRIC.classes.map(async (curClass) => {
        const raster = await loadCogWindow(
          `${config.dataBucketUrl}${curClass.filename}`,
          {
            windowBox: box,
            noDataValue: curClass.noDataValue,
          }
        );
        const overlapResult = await overlapRaster(
          METRIC.metricId,
          raster,
          sketch
        );
        return overlapResult.map(
          (metrics): Metric => ({
            ...metrics,
            classId: curClass.classId,
          })
        );
      })
    )
  ).reduce(
    // merge
    (metricsSoFar, curClassMetrics) => [...metricsSoFar, ...curClassMetrics],
    []
  );

  return {
    metrics: rekeyMetrics(metrics),
    sketch: toNullSketch(sketch, true),
  };
}

export default new GeoprocessingHandler(habitatProtection, {
  title: "essentialHabitat",
  description: "essential habitat overlap metrics",
  timeout: 120, // seconds
  executionMode: "async",
  // Specify any Sketch Class form attributes that are required
  requiresProperties: [],
  memory: 4096,
});
