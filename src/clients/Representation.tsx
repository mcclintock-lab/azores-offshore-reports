import React, { FunctionComponent } from "react";
import { ReportPageProps } from "../types/ReportPage";
import BenthicHabitat from "./BenthicHabitat";
import EssentialHabitat from "./EssentialHabitat";

const ReportPage: FunctionComponent<ReportPageProps> = ({ hidden }) => {
  return (
    <div style={{ display: hidden ? "none" : "block" }}>
      <BenthicHabitat />
      <EssentialHabitat />
    </div>
  );
};

export default ReportPage;
