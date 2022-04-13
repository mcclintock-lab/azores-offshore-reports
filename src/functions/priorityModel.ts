import {
  Sketch,
  SketchCollection,
  Feature,
  GeoprocessingHandler,
  Metric,
  Polygon,
  ReportResult,
  toNullSketch,
  overlapFeatures,
  rekeyMetrics,
  sortMetrics,
} from "@seasketch/geoprocessing";
import bbox from "@turf/bbox";
import config from "../_config";
import { fgbFetchAll } from "@seasketch/geoprocessing/dataproviders";

const METRIC = config.metricGroups.priorityModelGroups.priorityModelAreaOverlap;

export async function priorityModel(
  sketch: Sketch<Polygon> | SketchCollection<Polygon>
): Promise<ReportResult> {
  const box = sketch.bbox || bbox(sketch);

  const filename = `${config.dataBucketUrl}${METRIC.filename}`;
  const features = await fgbFetchAll<Feature<Polygon>>(filename, box);

  const metrics = (
    await Promise.all(
      METRIC.classes.map(async (curClass) => {
        const overlapResult = await overlapFeatures(
          METRIC.metricId,
          features,
          sketch,
          {
            chunkSize: 2000,
          }
        );
        // Transform from simple to extended metric
        return overlapResult.map(
          (metric): Metric => ({
            ...metric,
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
    metrics: sortMetrics(rekeyMetrics(metrics)),
    sketch: toNullSketch(sketch, true),
  };
}

export default new GeoprocessingHandler(priorityModel, {
  title: "priorityModel",
  description: "prioritization model area outputs within sketch",
  timeout: 60, // seconds
  executionMode: "async",
  memory: 2048,
  // Specify any Sketch Class form attributes that are required
  requiresProperties: [],
});
