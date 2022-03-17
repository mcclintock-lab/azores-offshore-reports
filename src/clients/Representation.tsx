import React, { FunctionComponent } from "react";
import { ReportPageProps } from "../types/ReportPage";
import BenthicHabitat from "./BenthicHabitat";

const ReportPage: FunctionComponent<ReportPageProps> = ({ hidden }) => {
  return (
    <div style={{ display: hidden ? "none" : "block" }}>
      <BenthicHabitat />
    </div>
  );
};

export default ReportPage;
