import React, { FunctionComponent } from "react";
import MpaRegActivitiesCard from "../components/MpaRegActivitiesCard";
import RegBasedClassification from "./RegBasedClassification";
import SizeCard from "./SizeCard";
import MinWidthCard from "./MinWidthCard";
import BathymetryCard from "./BathymetryCard";

interface ReportProps {
  hidden: boolean;
}

const Overview: FunctionComponent<ReportProps> = ({ hidden }) => {
  return (
    <div style={{ display: hidden ? "none" : "block" }}>
      <SizeCard />
      <MinWidthCard />
      <BathymetryCard />
      <RegBasedClassification />
      <MpaRegActivitiesCard />
    </div>
  );
};

export default Overview;
