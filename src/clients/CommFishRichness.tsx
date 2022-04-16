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
import { SpeciesRichnessTable } from "../components/SpeciesRichnessTable";
import config from "../_config";

import cFishRichTotals from "../../data/precalc/cfishRichnessOverlapTotals.json";
const precalcTotals = cFishRichTotals as ReportResultBase;

const METRIC = config.metricGroups.cFishRichGroups.cFishRichValueOverlap;

const CommFishRichness = () => {
  const [{ isCollection }] = useSketchProperties();
  return (
    <>
      <ResultsCard title="Fish Richness" functionName="cFishRichness">
        {(data: ReportResult) => {
          const percMetricId = `${METRIC.metricId}Perc`;

          console.log(data.metrics);

          const parentMetrics = metricsWithSketchId(data.metrics, [
            data.sketch.properties.id,
          ]);

          // Single sketch or collection top-level percent metrics
          const parentPercMetrics = toPercentMetric(
            parentMetrics,
            precalcTotals.metrics,
            percMetricId
          );

          // Merge metrics for table
          const parentMetricsPlusPerc = [
            ...parentMetrics,
            ...parentPercMetrics,
          ];

          return (
            <>
              <p>
                <i>Richness</i> is a measure of the number of species within a
                defined area. This report summarizes the richness of the 6
                commercially significant fish species. Plans should consider
                including these biologically rich areas to achieve planning
                objectives.
              </p>

              <Collapse title="Learn more">
                <p>
                  ℹ️ Overview: for this report, fish richness is based on where
                  suitable habitat exists for each species. The Azores planning
                  area (EEZ) was split up into a grid of 5 square kilometer
                  planning units. Suitability of each planning unit was then
                  prediced for each of the 6 commercially significant species.
                  The results were combined to answer how many species each
                  planning unit can sustain (0-6). Some areas are biologicial
                  hotspots and can support up to all 6 species.
                </p>
                <p>🎯 Planning Objective: None</p>
                <p>
                  🗺️ Source Data: Habitat suitability model (HSM). Note that
                  this is limited to the data-rich area.
                </p>
                <p>
                  📈 Report: the report tabulates the number of planning units
                  within the plan containing N species, where N is 1, 2, 3, 4,
                  5, or 6. The percentage of N within the plan is then
                  calculated by dividing the number of units with N species
                  within the plan by the total number in the whole planning
                  area.
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

              <SpeciesRichnessTable
                titleText=" "
                percColText="  "
                valueColText="Plan contains"
                rows={parentMetricsPlusPerc}
                dataGroup={METRIC}
                percMetricIdName={percMetricId}
                showLayerToggle={false}
                showArea={true}
                formatPerc
                options={{
                  classColWidth: "75%",
                  percColWidth: "25%",
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

export default CommFishRichness;
