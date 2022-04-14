import React, { FunctionComponent } from "react";
import RbcsActivitiesCard from "../components/RbcsActivitiesCard";
import ProtectionCard from "./ProtectionCard";
import ProtectionCardTwo from "./ProtectionCardTwo";
import SizeCard from "./SizeCard";
import SizeCardTwo from "./SizeCardTwo";
import BathymetryCard from "./BathymetryCard";
import FishingImpact from "./FishingImpact";
import { ReportPageProps } from "../types/ReportPage";

const ReportPage: FunctionComponent<ReportPageProps> = ({ hidden }) => {
  return (
    <div style={{ display: hidden ? "none" : "block" }}>
      <ProtectionCardTwo />
      <SizeCardTwo />
      <BathymetryCard />
      <RbcsActivitiesCard />
      <FishingImpact />
    </div>
  );
};

export default ReportPage;
