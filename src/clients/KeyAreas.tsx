import React, { FunctionComponent } from "react";
import Vme from "../functions/vme";
import { ReportPageProps } from "../types/ReportPage";
import PriorityModel from "./PriorityModel";
import VME from "./VME";

const ReportPage: FunctionComponent<ReportPageProps> = ({ hidden }) => {
  return (
    <div style={{ display: hidden ? "none" : "block" }}>
      <PriorityModel />
      <VME />
    </div>
  );
};

export default ReportPage;
