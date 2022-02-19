import React from "react";
import { ResultsCard, KeySection } from "@seasketch/geoprocessing/client-ui";
import {
  squareMeterToKilometer,
  percentWithEdge,
  roundLower,
  ReportResult,
  firstMatchingMetric,
} from "@seasketch/geoprocessing/client-core";
import config, { STUDY_REGION_AREA_SQ_METERS } from "../_config";

const METRIC_NAME = "areaOverlap";
const CONFIG = config;
const REPORT = CONFIG.reports.sizeReport;
const METRIC = REPORT.metrics[METRIC_NAME];

const SizeCard = () => (
  <ResultsCard title="Size" functionName="area">
    {(data: ReportResult) => {
      const areaMetric = firstMatchingMetric(
        data.metrics,
        (m) => m.sketchId === data.sketch.properties.id
      );

      const areaDisplay = roundLower(squareMeterToKilometer(areaMetric.value));
      const percArea = areaMetric.value / STUDY_REGION_AREA_SQ_METERS;
      const percDisplay = percentWithEdge(percArea);
      const areaUnitDisplay = "sq. km";
      return (
        <>
          <p>
            Marine management areas must be large enough to sustain focal
            species within their boundaries during their adult and juvenile life
            history phases. Different species move different distances as adults
            and juveniles, so larger areas may include more species.
          </p>

          <KeySection>
            This design is{" "}
            <b>
              {areaDisplay} {areaUnitDisplay}
            </b>
            , which is <b>{percDisplay}</b> of the total planning area.
          </KeySection>
        </>
      );
    }}
  </ResultsCard>
);

export default SizeCard;
