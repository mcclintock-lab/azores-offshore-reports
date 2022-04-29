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

import vmeTotals from "../../data/precalc/vmeTotals.json";
const vmePrecalcTotals = vmeTotals as ReportResultBase;

const METRIC = config.metricGroups.vmeGroups.vmeValueOverlap;

const ReportSection = () => {
  const [{ isCollection }] = useSketchProperties();
  return (
    <>
      <ResultsCard
        title="Known Vulnerable Marine Ecosystems"
        functionName="vme"
      >
        {(data: ReportResult) => {
          // Collection top-level or single sketch.
          const parentPercMetrics = metricsWithSketchId(
            toPercentMetric(
              data.metrics.filter(
                (m) => m.metricId === METRIC.metricId && m.classId
              ),
              vmePrecalcTotals.metrics
            ),
            [data.sketch.properties.id]
          );

          return (
            <>
              <p>
                Plans should ensure full protection of known Vulnerable Marine
                Ecosystems (VMEs). This report summarizes the proportion of each
                VME found in the plan.
              </p>
              <Collapse title="Learn more">
                <p>
                  ℹ️ Overview: Known VMEs are defined as areas that have been
                  scientifically explored, described, and that meet the FAO
                  criteria (FAO, 2009) for defining Vulnerable Marine Ecosystems
                  (Section 5.1.5).
                </p>
                <p>
                  12 large areas where identified that fit the FAO criteria
                  defining what constitutes a Vulnerable Marine Ecosystem (FAO,
                  2009). These areas consist of 3 portions of the MAR (Western
                  ridge, Ridge east of Gigante, Cavalo), eight seamounts (Oscar,
                  Gigante, Cavala, Beta, Voador, Condor, Don João de Castro, and
                  Formigas), and an area with several small mounds south-east of
                  Pico island. The seafloor west of Capelinhos volcano, in Faial
                  island, also fitted the FAO criteria and considered a VME but
                  is outside the spatial planning area (i.e. within 6nm from
                  shore).
                </p>
                <p>🎯 Planning Objectives:</p>
                <ul>
                  <li>
                    Ensure full protection (100%) of bona fide VME by 2023
                  </li>
                </ul>
                <p>
                  🗺️ Source Data: Unequivocal VMEs were identified based on
                  these criteria through analysis of video transects recorded
                  during exploration cruises. They consisted of known
                  hydrothermal vents and, particularly, vulnerable benthic
                  communities, which is mostly consisted of cold-water corals
                  and sponge aggregations.
                </p>
                <p>
                  A contour of the 12 areas was computed using the best
                  available bathymetry data. The PUs covered by more than 5% by
                  these VME polygons were kept as important areas.
                </p>

                <p>📈 Report:</p>
                <p>
                  Further Information:{" "}
                  <a target="_blank" href={`${config.externalLinks.scpReport}`}>
                    Report on Systematic Conservation Planning Scenarios for the
                    Azores Deep-Sea
                  </a>
                  <ul>
                    <li>
                      5.1.6 Important areas: known VMEs including hydrothermal
                      vents
                    </li>
                  </ul>
                </p>
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
  // Build agg sketch group objects with percValue for each class
  const subSketches = toNullSketchArray(data.sketch);
  const subSketchIds = subSketches.map((sk) => sk.properties.id);
  const subSketchMetrics = toPercentMetric(
    metricsWithSketchId(
      data.metrics.filter((m) => m.metricId === METRIC.metricId && m.classId),
      subSketchIds
    ),
    vmePrecalcTotals.metrics
  );
  const sketchRows = flattenBySketchAllClass(
    subSketchMetrics,
    METRIC.classes,
    subSketches
  );
  return <SketchClassTable rows={sketchRows} dataGroup={METRIC} formatPerc />;
};

export default ReportSection;
