import React, { FunctionComponent } from "react";
import { ReportPageProps } from "../types/ReportPage";
import PriorityModel from "./PriorityModel";

const ReportPage: FunctionComponent<ReportPageProps> = ({ hidden }) => {
  return (
    <div style={{ display: hidden ? "none" : "block" }}>
      <PriorityModel />
    </div>
  );
};

export default ReportPage;
