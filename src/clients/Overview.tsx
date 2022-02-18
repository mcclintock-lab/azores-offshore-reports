import React, { FunctionComponent } from "react";
import MpaRegActivitiesCard from "../components/MpaRegActivitiesCard";
import RegBasedClassification from "./RegBasedClassification";

interface ReportProps {
  hidden: boolean;
}

const Overview: FunctionComponent<ReportProps> = ({ hidden }) => {
  return (
    <div style={{ display: hidden ? "none" : "block" }}>
      <RegBasedClassification />
      <MpaRegActivitiesCard />
    </div>
  );
};

export default Overview;
