// Run inside workspace

import fs from "fs";
import config from "../src/_config";
import {
  FeatureCollection,
  Polygon,
  ReportResultBase,
  createMetric,
  rekeyMetrics,
} from "@seasketch/geoprocessing";
import area from "@turf/area";

const METRIC = config.metricGroups.priorityModelGroups.priorityModelAreaOverlap;
const DEST_PATH = `${__dirname}/precalc/${METRIC.datasourceId}Totals.json`;
const CLASS = METRIC.classes[0];

const allFc = JSON.parse(
  fs.readFileSync(`${__dirname}/dist/${METRIC.baseFilename}.json`).toString()
) as FeatureCollection<Polygon>;

const value = area(allFc);
const metrics = [
  createMetric({
    classId: CLASS.classId,
    metricId: METRIC.metricId,
    value,
  }),
];

const result: ReportResultBase = {
  metrics: rekeyMetrics(metrics),
};

fs.writeFile(DEST_PATH, JSON.stringify(result, null, 2), (err) =>
  err
    ? console.error("Error", err)
    : console.info(`Successfully wrote ${DEST_PATH}`)
);
