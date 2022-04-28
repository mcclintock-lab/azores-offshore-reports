import React from "react";
import {
  Collapse,
  ResultsCard,
  SketchClassTable,
  useSketchProperties,
} from "@seasketch/geoprocessing/client-ui";
import {
  ReportResult,
  ReportResultBase,
  toNullSketchArray,
  flattenBySketchAllClass,
  metricsWithSketchId,
  toPercentMetric,
  NullSketch,
  NullSketchCollection,
  Metric,
  MetricGroup,
} from "@seasketch/geoprocessing/client-core";
import cloneDeep from "lodash/cloneDeep";
import { ClassTable, ClassTableColumnConfig } from "../components/ClassTable";
import config from "../_config";

import gfwFishingEffortTotals from "../../data/precalc/gfwFishingEffortTotals.json";
import { clone } from "@turf/turf";
const precalcTotals = gfwFishingEffortTotals as ReportResultBase;

const METRIC =
  config.metricGroups.gfwFishingEffortGroups.gfwFishingEffortValueOverlap;

const FishingImpact = () => {
  const [{ isCollection }] = useSketchProperties();
  return (
    <>
      <ResultsCard
        title="Fishing Effort - 2019-2022"
        functionName="gfwFishingEffort"
      >
        {(data: ReportResult) => {
          const percMetricIdName = `${METRIC.metricId}Perc`;

          const metricsValueAndPerc = [
            ...data.metrics,
            ...toPercentMetric(
              data.metrics,
              precalcTotals.metrics,
              percMetricIdName
            ),
          ];

          const metricsAll = metricsValueAndPerc.filter((m) =>
            m.classId!.includes("all")
          );
          const metricGroupAll = {
            ...METRIC,
            classes: METRIC.classes.filter((cls) =>
              cls.classId.includes("all")
            ),
          };
          const parentMetricsAll = metricsWithSketchId(metricsAll, [
            data.sketch.properties.id,
          ]);

          const metricsByGearType = metricsValueAndPerc.filter((m) =>
            m.classId!.includes("gear_type")
          );
          const metricGroupByGearType = {
            ...METRIC,
            classes: METRIC.classes.filter((cls) =>
              cls.classId.includes("gear_type")
            ),
          };
          const parentMetricsByGearType = metricsWithSketchId(
            metricsByGearType,
            [data.sketch.properties.id]
          );

          const metricsByCountry = metricsValueAndPerc.filter((m) =>
            m.classId!.includes("country")
          );
          const metricGroupByCountry = {
            ...METRIC,
            classes: METRIC.classes.filter((cls) =>
              cls.classId.includes("country")
            ),
          };
          const parentMetricsByCountry = metricsWithSketchId(metricsByCountry, [
            data.sketch.properties.id,
          ]);

          const colWidths = {
            classColWidth: "40%",
            percColWidth: "40%",
            showMapWidth: "20%",
            goalWidth: "0%",
          };

          const colConfigs: ClassTableColumnConfig[] = [
            {
              columnLabel: "All Fishing",
              type: "class",
              width: 31,
            },
            {
              type: "metricValue",
              metricId: METRIC.metricId,
              valueFormatter: "integer",
              valueLabel: "hours",
              width: 20,
              colStyle: { textAlign: "right" },
              columnLabel: "Fishing Effort",
            },
            {
              type: "metricValue",
              metricId: percMetricIdName,
              valueFormatter: "percent",
              columnLabel: "Within Plan",
              width: 15,
              colStyle: { textAlign: "right" },
            },
            {
              type: "metricChart",
              metricId: percMetricIdName,
              valueFormatter: "percent",
              chartOptions: {
                showTitle: false,
              },
              width: 20,
            },
            {
              type: "layerToggle",
              width: 14,
            },
          ];

          const gearTypeColConfigs = cloneDeep(colConfigs);
          gearTypeColConfigs[0].columnLabel = "By Gear Type";

          const countryColConfigs = cloneDeep(colConfigs);
          countryColConfigs[0].columnLabel = "By Country";

          return (
            <>
              <p>
                This report summarizes the proportion of fishing effort from
                2019-2022 that is within this plan, as reported by Global
                Fishing Watch. The higher the percentage, the greater the
                potential impact to the fishery if access or activities are
                restricted.
              </p>

              <Collapse title="Learn more">
                <p>
                  🎯 Planning Objective: there is no specific objective/target
                  for limiting the potential impact to fishing activities.
                </p>
                <p>
                  🗺️ Source Data: <b>Apparent fishing effort</b> is measured
                  using transmissions (or "pings") broadcast by fishing vessels
                  using the automatic identification system (AIS) vessel
                  tracking system.
                </p>
                <p>
                  Machine learning models are then used to classify fishing
                  vessels and predict when they are fishing based on their
                  movement patterns and changes in speed.
                </p>
                <p>
                  Apparent fishing effort can then be calculated for any area by
                  summarizing the fishing hours for all fishing vessels in that
                  area.
                </p>
                <p>
                  📈 Report: Percentages are calculated by summing the total
                  amount of fishing effort (in hours) within the MPAs in this
                  plan, and dividing it by the total amount of fishing effort
                  (in hours) across the overall planning area. If the plan
                  includes multiple areas that overlap, the overlap is only
                  counted once.
                </p>
                <p>
                  There are a number of caveats and limitations to this data.
                  For further information:{" "}
                  <a
                    target="_blank"
                    href={`${config.externalLinks.gfwFishingEffort}`}
                  >
                    Global Fishing Watch - Apparent Fishing Effort
                  </a>
                </p>
              </Collapse>

              <ClassTable
                rows={parentMetricsAll}
                dataGroup={metricGroupAll}
                columnConfig={colConfigs}
              />
              {isCollection && (
                <Collapse title="Show by MPA">
                  {genSketchTable(data.sketch, metricsAll, metricGroupAll)}
                </Collapse>
              )}
              <br />

              <ClassTable
                rows={parentMetricsByGearType}
                dataGroup={metricGroupByGearType}
                columnConfig={gearTypeColConfigs}
              />
              {isCollection && (
                <Collapse title="Show by MPA">
                  {genSketchTable(
                    data.sketch,
                    metricsByGearType,
                    metricGroupByGearType
                  )}
                </Collapse>
              )}
              <br />

              <ClassTable
                rows={parentMetricsByCountry}
                dataGroup={metricGroupByCountry}
                columnConfig={countryColConfigs}
              />
              {isCollection && (
                <Collapse title="Show by MPA">
                  {genSketchTable(
                    data.sketch,
                    metricsByCountry,
                    metricGroupByCountry
                  )}
                </Collapse>
              )}
            </>
          );
        }}
      </ResultsCard>
    </>
  );
};

const genSketchTable = (
  sketch: NullSketch | NullSketchCollection,
  metrics: Metric[],
  metricGroup: MetricGroup
) => {
  const childSketches = toNullSketchArray(sketch);
  const childSketchIds = childSketches.map((sk) => sk.properties.id);

  const childSketchMetrics = metricsWithSketchId(metrics, childSketchIds);
  const sketchRows = flattenBySketchAllClass(
    childSketchMetrics,
    metricGroup.classes,
    childSketches
  );

  return (
    <SketchClassTable rows={sketchRows} dataGroup={metricGroup} formatPerc />
  );
};

export default FishingImpact;
