import React, { FunctionComponent } from "react";
import { ReportPageProps } from "../types/ReportPage";
import CommSigSpecies from "./CommSigSpecies";

const ReportPage: FunctionComponent<ReportPageProps> = ({ hidden }) => {
  return (
    <div style={{ display: hidden ? "none" : "block" }}>
      <CommSigSpecies />
    </div>
  );
};

export default ReportPage;
