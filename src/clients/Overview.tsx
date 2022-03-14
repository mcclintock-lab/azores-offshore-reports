import React, { FunctionComponent } from "react";
import RbcsActivitiesCard from "../components/RbcsActivitiesCard";
import ProtectionCard from "./ProtectionCard";
import SizeCard from "./SizeCard";
import BathymetryCard from "./BathymetryCard";

interface ReportProps {
  hidden: boolean;
}

const Overview: FunctionComponent<ReportProps> = ({ hidden }) => {
  return (
    <div style={{ display: hidden ? "none" : "block" }}>
      <SizeCard />
      <ProtectionCard />
      <BathymetryCard />
      <RbcsActivitiesCard />
    </div>
  );
};

export default Overview;
