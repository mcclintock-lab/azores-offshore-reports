import {
  Sketch,
  SketchCollection,
  Feature,
  GeoprocessingHandler,
  Polygon,
  toSketchArray,
} from "@seasketch/geoprocessing";
import { loadCogWindow } from "@seasketch/geoprocessing/dataproviders";
import config from "../_config";
import bbox from "@turf/bbox";

import { min, max, mean } from "simple-statistics";

// @ts-ignore
import geoblaze, { Georaster } from "geoblaze";

export interface BathymetryResults {
  /** minimum depth in sketch */
  min: number;
  /** maximum depth in sketch */
  max: number;
  /** avg depth in sketch */
  mean: number;
  units: string;
}

export async function bathymetry(
  sketch: Sketch<Polygon> | SketchCollection<Polygon>
): Promise<BathymetryResults> {
  try {
    const sketches = toSketchArray(sketch);
    const box = sketch.bbox || bbox(sketch);
    const raster = await loadCogWindow(`${config.dataBucketUrl}bathy.tif`, {
      windowBox: box,
    });
    return await bathyStats(sketches, raster);
  } catch (err) {
    console.error("bathymetry error", err);
    throw err;
  }
}

/**
 * Core raster analysis - given raster, counts number of cells with value that are within Feature polygons
 */
export async function bathyStats(
  /** Polygons to filter for */
  features: Feature<Polygon>[],
  /** bathymetry raster to search */
  raster: Georaster
): Promise<BathymetryResults> {
  const sketchStats = features.map((feature, index) => {
    try {
      // @ts-ignore
      const stats = geoblaze.stats(raster, feature, {
        calcMax: true,
        calcMean: true,
        calcMin: true,
      })[0];
      return { min: stats.min, max: stats.max, mean: stats.mean };
    } catch (err) {
      if (err === "No Values were found in the given geometry") {
        // Temp workaround
        const firstCoordValue = geoblaze.identify(
          raster,
          feature.geometry.coordinates[0][0]
        )[0];
        return {
          min: firstCoordValue,
          mean: firstCoordValue,
          max: firstCoordValue,
        };
      } else {
        throw err;
      }
    }
  });
  return {
    min: min(sketchStats.map((s) => s.min)),
    max: max(sketchStats.map((s) => s.max)),
    mean: mean(sketchStats.map((s) => s.mean)),
    units: "meters",
  };
}

export default new GeoprocessingHandler(bathymetry, {
  title: "bathymetry",
  description: "calculates bathymetry within given sketch",
  timeout: 60, // seconds
  executionMode: "async",
  // Specify any Sketch Class form attributes that are required
  requiresProperties: [],
  memory: 2048,
});
