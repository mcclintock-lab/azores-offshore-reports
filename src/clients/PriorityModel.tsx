import React from "react";
import {
  Collapse,
  ResultsCard,
  SketchClassTable,
  ClassTable,
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
import config from "../_config";

import priorityModelTotals from "../../data/precalc/priorityModelTotals.json";
const precalcTotals = priorityModelTotals as ReportResultBase;

const METRIC = config.metricGroups.priorityModelGroups.priorityModelAreaOverlap;

const PriorityModel = () => {
  const [{ isCollection }] = useSketchProperties();
  return (
    <>
      <ResultsCard
        title="Fisheries-based Priority Areas"
        functionName="priorityModel"
      >
        {(data: ReportResult) => {
          // Single sketch or collection top-level
          const parentMetrics = metricsWithSketchId(
            toPercentMetric(data.metrics, precalcTotals.metrics),
            [data.sketch.properties.id]
          );

          return (
            <>
              <p>
                63 areas have been pre-identified using a prioritization
                modeling approach that meets multiple objectives of this
                planning process while minimizing overlap with current deepwater
                longline fishing grounds. Consider including these areas in
                order to achieve planning goals while minimizing cost to this
                fishery.
              </p>
              <p>
                This report summarizes the percentage of the 63 areas that
                overlap with this plan.
              </p>

              <Collapse title="Learn more">
                <p>
                  ℹ️ Overview: A prioritization model was used to generate a
                  network of 63 potential protected areas. The model was
                  designed to optimize for restoring fish stocks of deep-sea
                  species while protecting natural diversity, ecosystem
                  structure, function, connectivity and resilience of deep-sea
                  communities in the Azores. It also used a{" "}
                  <i>varying fisheries-based cost model</i> in order avoid areas
                  with higher fishing effort and thus reduce the impact to this
                  fishery.
                </p>
                <p>
                  🎯 Planning Objective: there is no specific objective for
                  including these priority areas in your plan, but they can be
                  used to guide discussion.
                </p>
                📈 Report: Percentages are calculated by summing the portion of
                priority areas found within the plans MPAs, and dividing it by
                the sum of all priority areas. If the plan includes multiple
                MPAs that overlap, the overlap is only counted once.
                <p>
                  Further Information:{" "}
                  <a target="_blank" href={`${config.externalLinks.scpReport}`}>
                    Report on Systematic Conservation Planning Scenarios for the
                    Azores Deep-Sea
                  </a>
                </p>
                <ul>
                  <li>
                    Section 5.3.2 Implementation of the Planning Unit Cost
                  </li>
                  <li>
                    Section 10 Final Simplified Prioritization Solutions, Figure
                    94
                  </li>
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
                    type: "metricChart",
                    metricId: METRIC.metricId,
                    valueFormatter: "percent",
                    width: 45,
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

export default PriorityModel;
