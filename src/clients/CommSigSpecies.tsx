import React from "react";
import {
  Collapse,
  LayerToggle,
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

import cFishTotals from "../../data/precalc/cFishTotals.json";
const precalcTotals = cFishTotals as ReportResultBase;

const METRIC = config.metricGroups.cFishGroups.valueOverlap;

const CommSigSpecies = () => {
  const [{ isCollection }] = useSketchProperties();
  return (
    <>
      <ResultsCard title="Fish Habitat" functionName="cFish">
        {(data: ReportResult) => {
          // Single sketch or collection top-level
          const parentMetrics = metricsWithSketchId(
            toPercentMetric(data.metrics, precalcTotals.metrics),
            [data.sketch.properties.id]
          );

          return (
            <>
              <p>
                Plans should protect suitable habitat of commercially important
                deep-sea benthic fish species. This report summarizes the
                proportion of suitable habitat for each species found in this
                plan.
              </p>

              <Collapse title="Learn more">
                <p>
                  ℹ️ Overview: The presence of deep-sea benthic fish is largely
                  driven by where suitable habitat exists. All of the locations
                  predicted to have suitable habitat for each species to be
                  present was determined, and this report summarizes the
                  proportion (%) of suitable locations found within the plan.
                </p>
                <p>
                  🎯 Planning Objective: Protect at least 15% of suitable
                  habitat of commercially important deep-sea benthic fish
                  species by 2023. This has been interpreted as the objective is
                  met if the plan includes 15% of the predicted distribution of{" "}
                  <b>each</b> deep-sea benthic species.
                </p>
                <p>
                  🗺️ Source Data: Habitat suitability models (HSM) were
                  developed for six of the most commercially important deep-sea
                  benthic fishes occurring in the Azores.
                </p>
                <p>
                  Areas were identified as sufficiently suitable for a fish
                  species if their habitat suitability value reached a threshold
                  such that the species was predicted to be present in that
                  area. Note that habitat suitability data is only available for
                  the data-rich area.
                </p>
                <p>
                  📈 Report: Percentages of species distribution within the plan
                  is then calculated by summing the areas within the plan where
                  species are predicted to be present, and dividing it by the
                  total area a species is predicted to be present. If the plan
                  includes multiple areas that overlap, the overlap is only
                  counted once.
                </p>
                <p>
                  Further Information:{" "}
                  <a target="_blank" href={`${config.externalLinks.scpReport}`}>
                    Report on Systematic Conservation Planning Scenarios for the
                    Azores Deep-Sea
                  </a>
                </p>
                <ul>
                  <li>
                    Section 5.1.2 Commercially important deep-sea benthic fish
                    species
                  </li>
                </ul>
              </Collapse>

              <ClassTable
                titleText=" "
                valueColText="Within Plan"
                rows={parentMetrics}
                dataGroup={METRIC}
                percMetricIdName={METRIC.metricId}
                showLayerToggle={false}
                formatPerc
                options={{
                  classColWidth: "45%",
                  percColWidth: "55%",
                  showMapWidth: "0%",
                  goalWidth: "0%",
                }}
              />
              <LayerToggle
                label="View Fish Richness Layer"
                layerId={METRIC.layerId}
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

export default CommSigSpecies;
