import { DataClass, MetricGroup, Report } from "@seasketch/geoprocessing";
import { RbcsObjective } from "./types/objective";
import packageJson from "../package.json";
import geoprocessingJson from "../geoprocessing.json";

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
    : `https://gp-${packageJson.name}-datasets.s3.${geoprocessingJson.region}.amazonaws.com/`;

export const cogFileSuffix = "_cog.tif";
export const fgbFileSuffix = ".fgb";

//// EXTERNAL RESOURCES ////

const externalLinks = {
  scpReport:
    "https://s3.amazonaws.com/SeaSketch/SCP_Azores_final+report_v3.1.pdf",
};

//// OBJECTIVES ////

// Build project objectives up using RBCS types
export const projectSizeObjectiveIds = ["eez", "eezNoTake"] as const;
export const projectObjectiveIds = [
  ...projectSizeObjectiveIds,
  "benthicHabitat",
  "cFish",
] as const;
export type ProjectSizeObjectiveId = typeof projectSizeObjectiveIds[number];
export type ProjectObjectiveId = typeof projectObjectiveIds[number];
export type ProjectObjectives = Record<ProjectObjectiveId, RbcsObjective>;

/**
 * Type guard for checking string is one of supported objective IDs
 * Use in conditional block logic to coerce to type RbcsObjectiveKey within the block
 */
export function isProjectSizeObjectiveId(
  key: string
): key is ProjectSizeObjectiveId {
  return projectSizeObjectiveIds.includes(key as ProjectSizeObjectiveId);
}

/**
 * Type guard for checking string is one of supported objective IDs
 * Use in conditional block logic to coerce to type RbcsObjectiveKey within the block
 */
export function isProjectObjectiveId(key: string): key is ProjectObjectiveId {
  return projectObjectiveIds.includes(key as ProjectObjectiveId);
}

export const objectives: ProjectObjectives = {
  eez: {
    id: "eez",
    shortDesc: "30% of EEZ protected",
    target: 0.3,
    countsToward: {
      "Fully Protected Area": "yes",
      "Highly Protected Area": "yes",
      "Moderately Protected Area": "yes",
      "Poorly Protected Area": "no",
      "Unprotected Area": "no",
    },
  },
  eezNoTake: {
    id: "eezNoTake",
    shortDesc: "15% of EEZ no-take protection",
    target: 0.15,
    countsToward: {
      "Fully Protected Area": "yes",
      "Highly Protected Area": "no",
      "Moderately Protected Area": "no",
      "Poorly Protected Area": "no",
      "Unprotected Area": "no",
    },
  },
  benthicHabitat: {
    id: "benthic",
    shortDesc: "15% of each benthic habitat type",
    target: 0.15,
    countsToward: {
      "Fully Protected Area": "yes",
      "Highly Protected Area": "no",
      "Moderately Protected Area": "no",
      "Poorly Protected Area": "no",
      "Unprotected Area": "no",
    },
  },
  cFish: {
    id: "cFish",
    shortDesc: "15% of each species",
    target: 0.15,
    countsToward: {
      "Fully Protected Area": "yes",
      "Highly Protected Area": "no",
      "Moderately Protected Area": "no",
      "Poorly Protected Area": "no",
      "Unprotected Area": "no",
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

//// BATHYMETRY ////

export interface BathymetryResults {
  /** minimum depth in sketch */
  min: number;
  /** maximum depth in sketch */
  max: number;
  /** avg depth in sketch */
  mean: number;
  units: string;
}

//// FISHING IMPACT ////

const oceanUseClasses: DataClass[] = [
  {
    baseFilename: "bottom_longline_footprint",
    classId: "bottom_longline_footprint",
    display: "Fishing Footprint (area)",
    noDataValue: -3.39999995214436425e38,
    layerId: "6216c0f5824398156adaa071",
  },
  {
    baseFilename: "bottom_longline_effort",
    classId: "bottom_longline_effort",
    display: "Fishing Effort (value)",
    noDataValue: -3.39999995214436425e38,
    layerId: "6216c0f5824398156adaa073",
  },
];

const oceanUseGroups: Record<string, MetricGroup> = {
  valueOverlap: {
    metricId: "valueOverlap",
    datasourceId: "oceanUse",
    classes: oceanUseClasses.map((curClass) => {
      return {
        ...curClass,
        filename: `${curClass.baseFilename}${cogFileSuffix}`,
      };
    }),
  },
};

const fishingImpactReport: Report = {
  reportId: "fishingImpact",
  metrics: oceanUseGroups,
};

//// PRIORITIZATION MODEL SOLUTIONS

const priorityModelClasses: DataClass[] = [
  {
    classId: "fishbasedSolution",
    display: "Fisheries-based Solution",
  },
];

const priorityModelGroups: Record<string, MetricGroup> = {
  priorityModelAreaOverlap: {
    metricId: "priorityModelAreaOverlap",
    baseFilename: "ST_fishbased_solution",
    filename: "ST_fishbased_solution.fgb",
    classes: priorityModelClasses,
    layerId: "621d2020d885856e59f8a0f0",
    datasourceId: "priorityModel",
  },
};

const priorityModelReport: Report = {
  reportId: "priorityModel",
  metrics: priorityModelGroups,
};

//// GEOMORPHIC ////

// Multi-class raster (categorical)
const geomorphicClasses: DataClass[] = [
  {
    numericClassId: 1000,
    classId: "Island Shelf",
    display: "Island Shelf",
    goalValue: 0.15,
  },
  {
    numericClassId: 1100,
    classId: "Island Shelf Unit",
    display: "Island Shelf Unit",
    goalValue: 0.15,
  },
  {
    numericClassId: 2001,
    classId: "High Relief",
    display: "High Relief",
    goalValue: 0.15,
  },
  {
    numericClassId: 2101,
    classId: "High Relief Unit",
    display: "High Relief Unit",
    goalValue: 0.15,
  },
  {
    numericClassId: 3001,
    classId: "Low Relief",
    display: "Low Relief",
    goalValue: 0.15,
  },
  {
    numericClassId: 3101,
    classId: "Low Relief Unit",
    display: "Low Relief Unit",
    goalValue: 0.15,
  },
  {
    numericClassId: 4001,
    classId: "Depression",
    display: "Depression",
    goalValue: 0.15,
  },
  {
    numericClassId: 5001,
    classId: "Flat Areas",
    display: "Flat Areas",
    goalValue: 0.15,
  },
  {
    numericClassId: 6001,
    classId: "Hill and Lower Slopes",
    display: "Hill and Lower Slopes",
    goalValue: 0.15,
  },
];

const gmuValueOverlap: MetricGroup = {
  metricId: "gmuValueOverlap",
  baseFilename: "geomorphic_units",
  filename: `geomorphic_units${cogFileSuffix}`,
  datasourceId: "geomorphic",
  // @ts-ignore: need to add objective to type
  objective: objectives.benthicHabitat,
  layerId: "6216c0f5824398156adaa06f",
  classes: geomorphicClasses.map((curClass) => {
    return {
      ...curClass,
      filename: `${curClass.baseFilename}${cogFileSuffix}`,
    };
  }),
};

const habitatProtection: Report = {
  reportId: "habitatProtection",
  metrics: {
    gmuValueOverlap,
  },
};

//// COMMERCIALLY IMPORTANT SPECIES ////

const cFishClasses: DataClass[] = [
  {
    baseFilename: "cfish_1",
    classId: "splendens",
    display: "Alfonsins (B. splendens)",
    noDataValue: -3.39999995214436425e38,
  },
  {
    baseFilename: "cfish_2",
    classId: "kuhlii",
    display: "Cântaro (P. kuhlii)",
    noDataValue: -3.39999995214436425e38,
  },
  {
    baseFilename: "cfish_3",
    classId: "dactylopterus",
    display: "Boca-negra (H. dactylopterus)",
    noDataValue: -3.39999995214436425e38,
  },
  {
    baseFilename: "cfish_4",
    classId: "americanus",
    display: "Cherne (P. americanus)",
    noDataValue: -3.39999995214436425e38,
  },
  {
    baseFilename: "cfish_5",
    classId: "bogaraveo",
    display: "Goraz (P. bogaraveo)",
    noDataValue: -3.39999995214436425e38,
  },
  {
    baseFilename: "cfish_6",
    classId: "decadactylus",
    display: "Alfonsins (B. decadactylus)",
    noDataValue: -3.39999995214436425e38,
  },
];

const cFishGroups: Record<string, MetricGroup> = {
  valueOverlap: {
    metricId: "valueOverlap",
    datasourceId: "cFish",
    // @ts-ignore: need to add objective to type
    objective: objectives.cFish,
    layerId: "621ac583075911e90781aeb0",
    classes: cFishClasses.map((curClass) => {
      return {
        ...curClass,
        filename: `${curClass.baseFilename}${cogFileSuffix}`,
      };
    }),
  },
};

const commSigSpecies: Report = {
  reportId: "commSigSpecies",
  metrics: cFishGroups,
};

export default {
  STUDY_REGION_AREA_SQ_METERS,
  units,
  localDataUrl,
  dataBucketUrl,
  objectives,
  externalLinks,
  reports: {
    sizeReport,
    protection,
    fishingImpact: fishingImpactReport,
    commSigSpecies,
    priorityModelReport,
  },
  metricGroups: {
    oceanUse: oceanUseGroups,
    gmuValueOverlap,
    cFishGroups,
    priorityModelGroups,
  },
};
