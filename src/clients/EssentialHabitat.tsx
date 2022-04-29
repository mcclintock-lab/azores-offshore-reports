import React from "react";
import {
  Collapse,
  SketchClassTable,
  ResultsCard,
  useSketchProperties,
  LayerToggle,
  ClassTable,
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

import essentialHabitatTotals from "../../data/precalc/essentialHabitatTotals.json";
const essentialHabitatPrecalcTotals =
  essentialHabitatTotals as ReportResultBase;

const METRIC = config.metricGroups.essentialHabitatGroups.essentialValueOverlap;

const ReportSection = () => {
  const [{ isCollection }] = useSketchProperties();
  return (
    <>
      <ResultsCard title="Essential Habitat" functionName="essentialHabitat">
        {(data: ReportResult) => {
          // Collection top-level or single sketch.
          const parentPercMetrics = metricsWithSketchId(
            toPercentMetric(
              data.metrics.filter(
                (m) => m.metricId === METRIC.metricId && m.classId
              ),
              essentialHabitatPrecalcTotals.metrics
            ),
            [data.sketch.properties.id]
          );

          return (
            <>
              <p>
                Plans should ensure the protection of essential deep-sea
                habitat. This report summarizes the proportion of each essential
                habitat found in the plan.
              </p>
              <Collapse title="Learn more">
                <p>
                  ℹ️ Overview: It's important to note that there is an
                  insufficient understanding of what is an essential habitat in
                  the Azores, and limited data for the abyssal deep sea. However
                  certain areas have been included because they were considered
                  to be of high conservation importance.
                </p>
                <p>🎯 Planning Objectives:</p>
                <ul>
                  <li>
                    Protect a minimum of 75% of the known essential deep-sea
                    habitat by 2023. The objective is met if the plan includes
                    75% of <b>each</b> essential habitat type. Plan MPA's must
                    achieve a protection level of Full to count towards this
                    objective.
                  </li>
                  <li>
                    Rebuild fish stocks of commercially important deep-sea
                    benthic species to those levels prior to the 1990's by 2040
                  </li>
                </ul>
                <p>🗺️ Source Data: </p>
                <p>
                  <b>Essential fish habitat</b>: Essential fish habitat (EFH)
                  represents those waters and substrates essential to the
                  ecological and biological requirements for critical
                  life-history stages of exploited fish and, therefore,
                  necessary for spawning, breeding, feeding, growth to maturity,
                  or for migrations. Sedlo and the Hard Rock Cafe seamounts have
                  been included as an EFH because of the observations of massive
                  reproductive aggregations of fish species, such as the orange
                  roughy (Hoplostethus atlanticus), splendid alfonsino (Beryx
                  splendens) and cardinalfish (Epigonus telescopus).
                </p>
                <p>
                  <b>Seamounts</b>: a seamount is an underwater mountain formed
                  by volcanic activity. Seamounts are considered essential
                  habitat because of the perceived rich biodiversity and
                  vulnerability of some seamount communities to human
                  activities. 11 shallow and 2 deep water seamounts were
                  identified. Their protection is considered relevant to address
                  management objectives related to protecting hotspots of
                  biodiversity, maintaining of biological diversity, and
                  rebuilding of fish stocks. Information on the location of
                  shallow water seamounts is adequate since great efforts to map
                  the shallower portion of the Azores EEZ have been made in
                  recent years. However, most of the abyssal plain in the Azores
                  is not mapped and therefore many very deep topographic
                  features are still to be revealed.
                </p>
                <p>
                  📈 Report: Percentages are calculated for each habitat type by
                  summing the habitat within this plan, then dividing by the
                  total habitat area within the planning area. If the plan
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
                  <li>5.1.7 Essential Fish Habitat</li>
                  <li>5.1.7 Shallow and very deep seamounts</li>
                </ul>
              </Collapse>
              <LayerToggle
                label="View Benthic Habitat Layer"
                layerId={METRIC.layerId}
              />
              <ClassTable
                rows={parentPercMetrics}
                dataGroup={METRIC}
                columnConfig={[
                  {
                    type: "class",
                    width: 35,
                    columnLabel: "Habitat Type",
                  },
                  {
                    type: "metricChart",
                    metricId: METRIC.metricId,
                    valueFormatter: "percent",
                    width: 50,
                  },
                  {
                    type: "layerToggle",
                    width: 15,
                  },
                ]}
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
    essentialHabitatPrecalcTotals.metrics
  );
  const sketchRows = flattenBySketchAllClass(
    subSketchMetrics,
    METRIC.classes,
    subSketches
  );
  return <SketchClassTable rows={sketchRows} dataGroup={METRIC} formatPerc />;
};

export default ReportSection;
