import { DataClass, Report } from "@seasketch/geoprocessing";
import { ProjectObjectives } from "./types/objective";

/**
 * Area of ocean within eez minus land in square miles. Calculated by drawing
 * sketch in seasketch project, exporting the resulting sketch, calling turf/area function on it */
export const STUDY_REGION_AREA_SQ_METERS = 961942457512.9614;
export const STUDY_REGION_AREA_SQ_KM = STUDY_REGION_AREA_SQ_METERS / 1000;

export const units = "metric";

export const localDataUrl = `http://127.0.0.1:8080/`;
export const dataBucketUrl =
  process.env.NODE_ENV === "test"
    ? localDataUrl
    : `https://gp-azores-offshore-reports-datasets.s3.eu-west-3.amazonaws.com/`;

export const cogFileSuffix = "_cog.tif";
export const fgbFileSuffix = ".fgb";

//// OBJECTIVES ////

export const objectives: ProjectObjectives = {
  eez: {
    target: 0.3,
    countsToward: {
      1: "no",
      2: "no",
      3: "no",
      4: "yes",
      5: "yes",
    },
  },
  eezNoTake: {
    target: 0.15,
    countsToward: {
      1: "no",
      2: "no",
      3: "no",
      4: "no",
      5: "yes",
    },
  },
};

//// AREA ////

const sizeReport: Report = {
  reportId: "area",
  metrics: {
    areaOverlap: {
      metricId: "areaOverlap",
      baseFilename: "nearshore_dissolved",
      filename: "nearshore_dissolved.fgb",
      classes: [
        {
          classId: "eez",
          display: "EEZ",
        },
      ],
      layerId: "6164aebea04323106537eb5a",
    },
  },
};

//// PROTECTION ////

const protection: Report = {
  reportId: "protection",
  metrics: {
    areaOverlap: {
      metricId: "areaOverlap",
      classes: [
        {
          classId: "eez",
          display: "EEZ",
        },
      ],
    },
  },
};

export default {
  STUDY_REGION_AREA_SQ_METERS,
  units,
  localDataUrl,
  dataBucketUrl,
  objectives,
  reports: {
    sizeReport,
    protection,
  },
};
