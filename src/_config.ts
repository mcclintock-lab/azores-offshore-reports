import { DataClass, Report } from "@seasketch/geoprocessing";

/**
 * Area of ocean within eez minus land in square miles. Calculated by drawing
 * sketch in seasketch project, exporting the resulting sketch, calling turf/area function on it and converting square
 * meters to square miles */
export const STUDY_REGION_AREA_SQ_METERS = undefined;

export const units = "metric";

export const localDataUrl = `http://127.0.0.1:8080/`;
export const dataBucketUrl =
  process.env.NODE_ENV === "test"
    ? localDataUrl
    : `https://gp-azores-offshore-reports-datasets.s3.ap-southeast-2.amazonaws.com/`;

export const cogFileSuffix = "_cog.tif";
export const fgbFileSuffix = ".fgb";

//// OBJECTIVES ////

export const objectives = {};

//// HABITAT PROTECTION ////

export default {
  STUDY_REGION_AREA_SQ_METERS,
  units,
  localDataUrl,
  dataBucketUrl,
  objectives,
  reports: {},
};
