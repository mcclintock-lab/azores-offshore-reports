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
} from "@seasketch/geoprocessing/client-core";
import { ClassTable } from "../components/ClassTable";
import config from "../_config";

import oceanUseTotals from "../../data/precalc/oceanUseTotals.json";
const precalcTotals = oceanUseTotals as ReportResultBase;

const REPORT = config.reports.fishingImpact;
const METRIC = REPORT.metrics.valueOverlap;

const FishingImpact = () => {
  const [{ isCollection }] = useSketchProperties();
  return (
    <>
      <ResultsCard title="Fishing Effort - 2002-2018" functionName="oceanUse">
        {(data: ReportResult) => {
          // Single sketch or collection top-level
          const parentMetrics = metricsWithSketchId(
            toPercentMetric(data.metrics, precalcTotals.metrics),
            [data.sketch.properties.id]
          );

          return (
            <>
              <p>
                This report summarizes plan overlap with deep-water bottom
                longline fishing activity. The higher the percentage, the
                greater the potential impact to the fishery if access or
                activities are restricted.
              </p>

              <Collapse title="Learn more">
                <p>
                  ℹ️ Fishing Footprint is the predicted extent of fishing, and
                  is reported as the percentage of total footprint area within
                  the plan. Fishing Effort is the predicted amount of fishing
                  effort/activity for each planning unit within the footprint,
                  and is reported as the percentage of total fishing effort
                  found within the plan.
                </p>
                <p>
                  Fishing Effort is used as a proxy for measuring the potential
                  economic loss to fisheries caused by the creation of protected
                  areas. This report can be used to minimize the potential
                  impact of a plan on a fishery, as well as identify and reduce
                  conflict between conservation objectives and fishing
                  activities.
                </p>
                <p>
                  🎯 Planning Objective: there is no specific objective/target
                  for limiting the potential impact to fishing activities.
                </p>
                <p>
                  🗺️ Source Data: The footprint of fishing activity and
                  assessment of fishing effort within that footprint comes from
                  an analysis of Vessel Monitoring System (VMS) data for vessels
                  licensed for bottom longline or handline fishing gears. 74
                  vessels were included anonymously, representing ~25% of the
                  total fleet.
                </p>
                <p>
                  The resulting dataset represents predicted fishing effort for
                  the deep water bottom longline fishery. It's limited to this
                  fishery mainly because it is the primary human activity
                  occurring in the deep waters of the Azores.
                </p>
                <p>
                  📈 Report: Percentages are calculated by summing the areas of
                  fishing footprint/effort within the MPAs in this plan, and
                  dividing it by the total area of fishing footprint/effort in
                  the overall planning area. If the plan includes multiple areas
                  that overlap, the overlap is only counted once.
                </p>
                <p>
                  Further Information:{" "}
                  <a target="_blank" href={`${config.externalLinks.scpReport}`}>
                    Report on Systematic Conservation Planning Scenarios for the
                    Azores Deep-Sea
                  </a>
                </p>
                <ul>
                  <li>Section 5.3 Cost Model</li>
                  <li>Section 5.3.1 Deep Water Bottom Fishing Effort Data</li>
                </ul>
              </Collapse>

              <ClassTable
                rows={parentMetrics}
                dataGroup={METRIC}
                columnConfig={[
                  {
                    columnLabel: "  ",
                    type: "class",
                    width: 40,
                  },
                  {
                    type: "metricValue",
                    metricId: METRIC.metricId,
                    valueFormatter: "percent",
                    columnLabel: "Within Plan",
                    width: 15,
                    colStyle: { textAlign: "right" },
                  },
                  {
                    type: "metricChart",
                    metricId: METRIC.metricId,
                    valueFormatter: "percent",
                    chartOptions: {
                      showTitle: false,
                    },
                    width: 30,
                  },
                  {
                    type: "layerToggle",
                    width: 15,
                  },
                ]}
              />
              {isCollection && (
                <Collapse title="Show by MPA">{genSketchTable(data)}</Collapse>
              )}
            </>
          );
        }}
      </ResultsCard>
    </>
  );
};

const genSketchTable = (data: ReportResult) => {
  const childSketches = toNullSketchArray(data.sketch);
  const childSketchIds = childSketches.map((sk) => sk.properties.id);
  const childSketchMetrics = toPercentMetric(
    metricsWithSketchId(data.metrics, childSketchIds),
    precalcTotals.metrics
  );
  const sketchRows = flattenBySketchAllClass(
    childSketchMetrics,
    METRIC.classes,
    childSketches
  );

  return <SketchClassTable rows={sketchRows} dataGroup={METRIC} formatPerc />;
};

export default FishingImpact;
