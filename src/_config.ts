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
  gfwFishingEffort:
    "https://globalfishingwatch.org/dataset-and-code-fishing-effort",
};

//// OBJECTIVES ////

// Build project objectives up using RBCS types
export const projectSizeObjectiveIds = ["eez", "eezNoTake"] as const;
export const projectObjectiveIds = [
  ...projectSizeObjectiveIds,
  "benthicHabitat",
  "essentialHabitat",
  "cFish",
  "vme",
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
  essentialHabitat: {
    id: "essential",
    shortDesc: "75% of each essential habitat type",
    target: 0.75,
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
  vme: {
    id: "vme",
    shortDesc: "100% of known VME",
    target: 1.0,
    countsToward: {
      "Fully Protected Area": "yes",
      "Highly Protected Area": "no",
      "Moderately Protected Area": "no",
      "Poorly Protected Area": "no",
      "Unprotected Area": "no",
    },
  },
};

//// SIZE / PROTECTION ////

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

//// GLOBAL FISHING WATCH 2019-2022 ////

const gfwFishingEffortClasses: DataClass[] = [
  {
    baseFilename: "all-fish-19-22",
    classId: "all",
    display: "All Fishing 2019-2022",
    noDataValue: -3.39999995214436425e38,
    layerId: "62421ff87c16283c3e3bf4c4",
  },
  {
    baseFilename: "drifting_longlines",
    classId: "gear_type:drifting_longlines",
    display: "Drifting Longline",
    noDataValue: -3.39999995214436425e38,
    layerId: "62421ff87c16283c3e3bf4cc",
  },
  {
    baseFilename: "pole_and_line",
    classId: "gear_type:pole_and_line",
    display: "Pole and Line",
    noDataValue: -3.39999995214436425e38,
    layerId: "62421ff87c16283c3e3bf4d0",
  },
  {
    baseFilename: "set_longlines",
    classId: "gear_type:set_longlines",
    display: "Set Longline",
    noDataValue: -3.39999995214436425e38,
    layerId: "62421ff87c16283c3e3bf4d4",
  },
  {
    baseFilename: "fixed_gear",
    classId: "gear_type:fixed_gear",
    display: "Fixed Gear",
    noDataValue: -3.39999995214436425e38,
    layerId: "62421ff87c16283c3e3bf4ce",
  },
  {
    baseFilename: "purse_seines",
    classId: "gear_type:purse_seines",
    display: "Purse Seine",
    noDataValue: -3.39999995214436425e38,
    layerId: "62421ff87c16283c3e3bf4d2",
  },
  {
    baseFilename: "other_purse_seines",
    classId: "gear_type:other_purse_seines",
    display: "Other Purse Seine",
    noDataValue: -3.39999995214436425e38,
    layerId: "62421ff87c16283c3e3bf4d8",
  },
  {
    baseFilename: "set_gillnets",
    classId: "gear_type:set_gillnets",
    display: "Set Gillnet",
    noDataValue: -3.39999995214436425e38,
    layerId: "62421ff87c16283c3e3bf4d6",
  },
  {
    baseFilename: "trawlers",
    classId: "gear_type:trawlers",
    display: "Trawler",
    noDataValue: -3.39999995214436425e38,
    layerId: "62421ff87c16283c3e3bf4da",
  },
  {
    baseFilename: "trollers",
    classId: "gear_type:trollers",
    display: "Troller",
    noDataValue: -3.39999995214436425e38,
    layerId: "62421ff87c16283c3e3bf4dc",
  },
  {
    baseFilename: "PRT",
    classId: "country:prt",
    display: "Portugal",
    noDataValue: -3.39999995214436425e38,
    layerId: "62421ff87c16283c3e3bf4c6",
  },
  {
    baseFilename: "ESP",
    classId: "country:esp",
    display: "Spain",
    noDataValue: -3.39999995214436425e38,
    layerId: "62421ff87c16283c3e3bf4c8",
  },
  {
    baseFilename: "RUS",
    classId: "country:rus",
    display: "Russia",
    noDataValue: -3.39999995214436425e38,
    layerId: "62421ff87c16283c3e3bf4c8",
  },
];

const gfwFishingEffortGroups: Record<string, MetricGroup> = {
  gfwFishingEffortValueOverlap: {
    metricId: "gfwFishingEffortValueOverlap",
    datasourceId: "gfwFishingEffort",
    classes: gfwFishingEffortClasses.map((curClass) => {
      return {
        ...curClass,
        filename: `${curClass.baseFilename}${cogFileSuffix}`,
      };
    }),
  },
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

//// VME ////

// Single-class rasters
const vmeClasses: DataClass[] = [
  {
    baseFilename: "hv5km",
    filename: `hv5km${cogFileSuffix}`,
    noDataValue: -3.39999995214436425e38,
    classId: "HydrothermalVent",
    display: "Hydrothermal Vents",
    layerId: "623387e0ff85443a71b354cf",
    goalValue: 1,
  },
  {
    baseFilename: "VMEs_in_PUs_5pct",
    filename: `VMEs_in_PUs_5pct${cogFileSuffix}`,
    noDataValue: -3.39999995214436425e38,
    classId: "BenthicCommunities",
    display: "Benthic Communities",
    layerId: "",
    goalValue: 1,
  },
];

const vmeGroups: Record<string, MetricGroup> = {
  vmeValueOverlap: {
    metricId: "vmeValueOverlap",
    datasourceId: "vme",
    // @ts-ignore: need to add objective to type
    objective: objectives.vme,
    classes: vmeClasses,
  },
};

const vme: Report = {
  reportId: "vme",
  metrics: vmeGroups,
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

const benthicHabitat: Report = {
  reportId: "benthicHabitat",
  metrics: {
    gmuValueOverlap,
  },
};

//// ESSENTIAL HABITAT ////

// Single-class rasters
const essentialHabitatClasses: DataClass[] = [
  {
    baseFilename: "EFH",
    filename: `EFH${cogFileSuffix}`,
    noDataValue: -3.39999995214436425e38,
    classId: "EssentialFishHabitat",
    display: "Essential Fish Habitat",
    layerId: "62311e435679e26d267fe2e0",
    goalValue: 0.75,
  },
  {
    baseFilename: "SWSM",
    filename: `SWSM${cogFileSuffix}`,
    noDataValue: -3.39999995214436425e38,
    classId: "ShallowSeamount",
    display: "Shallow Seamount",
    layerId: "62311e435679e26d267fe2e6",
    goalValue: 0.75,
  },
  {
    baseFilename: "DWSM",
    filename: `DWSM${cogFileSuffix}`,
    noDataValue: -3.39999995214436425e38,
    classId: "DeepSeamount",
    display: "Deep Seamount",
    layerId: "62311e435679e26d267fe2e4",
    goalValue: 0.75,
  },
];

const essentialHabitatGroups: Record<string, MetricGroup> = {
  essentialValueOverlap: {
    metricId: "essentialValueOverlap",
    datasourceId: "essentialHabitat",
    // @ts-ignore: need to add objective to type
    objective: objectives.essentialHabitat,
    classes: essentialHabitatClasses,
  },
};

const essentialHabitat: Report = {
  reportId: "essentialHabitat",
  metrics: essentialHabitatGroups,
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

//// FISH RICHNESS ////

// N count raster
const cFishRichClasses: DataClass[] = Array.from({ length: 6 }, (v, i) => ({
  numericClassId: i + 1,
  classId: `${i + 1}`,
  display: `${i + 1}`,
}));

const cFishRichGroups: Record<string, MetricGroup> = {
  cFishRichValueOverlap: {
    metricId: "cFishRichValueOverlap",
    baseFilename: "cfishRichnessAll",
    filename: `cfishRichnessAll${cogFileSuffix}`,
    datasourceId: "cfishRichness",
    layerId: "621ac583075911e90781aeb0",
    classes: cFishRichClasses,
  },
};

const cFishRichReport: Report = {
  reportId: "cFishRichness",
  metrics: cFishRichGroups,
};

export default {
  STUDY_REGION_AREA_SQ_METERS,
  units,
  localDataUrl,
  dataBucketUrl,
  objectives,
  externalLinks,
  reports: {
    protection,
    fishingImpact: fishingImpactReport,
    commSigSpecies,
    priorityModelReport,
    benthicHabitat,
    essentialHabitat,
    cFishRichReport,
    vme,
  },
  metricGroups: {
    oceanUse: oceanUseGroups,
    gfwFishingEffortGroups,
    gmuValueOverlap,
    essentialHabitatGroups,
    cFishGroups,
    priorityModelGroups,
    cFishRichGroups,
    vmeGroups,
  },
};
