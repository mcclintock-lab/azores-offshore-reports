import React, { FunctionComponent } from "react";
import { ReportPageProps } from "../types/ReportPage";
import CommSigSpecies from "./CommSigSpecies";
import CommFishRichness from "./CommFishRichness";

const ReportPage: FunctionComponent<ReportPageProps> = ({ hidden }) => {
  return (
    <div style={{ display: hidden ? "none" : "block" }}>
      <CommSigSpecies />
      <CommFishRichness />
    </div>
  );
};

export default ReportPage;
