import React from "react";
import { ResultsCard, KeySection } from "@seasketch/geoprocessing/client-ui";
import { BathymetryResults } from "../_config";

const Percent = new Intl.NumberFormat("en", {
  style: "percent",
  maximumFractionDigits: 1,
});

const formatDepth = (val: number) => {
  const baseVal = Math.abs(parseInt(val.toString()));
  return val <= 0 ? `-${baseVal}m` : `+${baseVal}m`;
};

const BathymetryCard = () => (
  <ResultsCard title="Depth" functionName="bathymetry">
    {(data: BathymetryResults) => {
      return (
        <>
          <KeySection
            style={{ display: "flex", justifyContent: "space-around" }}
          >
            <span>
              Min: <b>{formatDepth(data.max)}</b>
            </span>
            <span>
              Avg: <b>{formatDepth(data.mean)}</b>
            </span>
            <span>
              Max: <b>{formatDepth(data.min)}</b>
            </span>
          </KeySection>
        </>
      );
    }}
  </ResultsCard>
);

export default BathymetryCard;
