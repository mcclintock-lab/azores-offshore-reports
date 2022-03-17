import React from "react";
import {
  Collapse,
  SketchClassTable,
  ResultsCard,
  useSketchProperties,
  LayerToggle,
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

import gmuValueOverlapTotals from "../../data/precalc/gmuValueOverlapTotals.json";
const gmuValueOverlapPrecalcTotals = gmuValueOverlapTotals as ReportResultBase;

const METRIC = config.metricGroups.gmuValueOverlap;

const BenthicHabitat = () => {
  const [{ isCollection }] = useSketchProperties();
  return (
    <>
      <ResultsCard title="Benthic Habitat" functionName="gmu">
        {(data: ReportResult) => {
          // Collection top-level or single sketch.
          const parentPercMetrics = metricsWithSketchId(
            toPercentMetric(
              data.metrics.filter(
                (m) => m.metricId === METRIC.metricId && m.classId
              ),
              gmuValueOverlapPrecalcTotals.metrics
            ),
            [data.sketch.properties.id]
          );

          return (
            <>
              <p>
                Plans should ensure the protection of representative deep-sea
                benthic habitats and associated ecosystems. This report
                summarizes the proportion of each habitat found in the plan.
              </p>
              <Collapse title="Learn more">
                <p>
                  ℹ️ Overview: Benthic habitat refers to habitat occurring/found
                  on the bottom of the sea. Ensuring the protection of
                  representative deep-sea benthic habitats and associated
                  ecosystems requires being able to identify where each of these
                  habitats occur, and ensuring that a sufficient amount of each
                  is represented in a plan. This report summarizes the
                  proportion (%) of each habitat predicted to be found in this
                  plan.
                </p>
                <p>
                  🎯 Planning Objective: Ensure that at least 15% of all
                  deep-sea benthic habitats and associated ecosystems are
                  protected by 2023. The objective is met if the plan includes
                  15% of each benthic habitat type.
                </p>
                <p>
                  🗺️ Source Data: The analysis chosen for this report is
                  particularly useful because it doesn't require biological
                  data. So it can be used for the entire Azores planning area,
                  including the data-poor abyssal area where little biological
                  information is available. The best available data on depth,
                  seabed slope, and other environmental characteristics were
                  used together to predict the presence of 9 distinct seabed
                  habitat types across the entire planning area.
                </p>
                <p>
                  📈 Report: Percentages are calculated by counting the number
                  of cells within this plan for each habitat type, then dividing
                  by the total number of cells within the planning area for each
                  habitat type. If the plan includes multiple areas that
                  overlap, the overlap is only counted once.
                </p>
                <p>
                  Further Information:{" "}
                  <a target="_blank" href={`${config.externalLinks.scpReport}`}>
                    Report on Systematic Conservation Planning Scenarios for the
                    Azores Deep-Sea
                  </a>
                </p>
                <ul>
                  <li>Section 5.1.1 Seabed Habitats </li>
                </ul>
              </Collapse>
              <LayerToggle
                label="View Benthic Habitat Layer"
                layerId={METRIC.layerId}
              />
              <ClassTable
                titleText="Habitat Type"
                rows={parentPercMetrics}
                dataGroup={METRIC}
                showGoal={false}
                showLayerToggle={false}
                formatPerc
                options={{
                  classColWidth: "45%",
                  percColWidth: "55%",
                  showMapWidth: "0%",
                  goalWidth: "0%",
                }}
              />
              {isCollection && (
                <Collapse title="Show by MPA">
                  {genGmuHabitatSketchTable(data)}
                </Collapse>
              )}
            </>
          );
        }}
      </ResultsCard>
    </>
  );
};

const genGmuHabitatSketchTable = (data: ReportResult) => {
  // Build agg sketch group objects with percValue for each class
  const subSketches = toNullSketchArray(data.sketch);
  const subSketchIds = subSketches.map((sk) => sk.properties.id);
  const subSketchMetrics = toPercentMetric(
    metricsWithSketchId(
      data.metrics.filter((m) => m.metricId === METRIC.metricId && m.classId),
      subSketchIds
    ),
    gmuValueOverlapPrecalcTotals.metrics
  );
  const sketchRows = flattenBySketchAllClass(
    subSketchMetrics,
    METRIC.classes,
    subSketches
  );
  return <SketchClassTable rows={sketchRows} dataGroup={METRIC} formatPerc />;
};

export default BenthicHabitat;
