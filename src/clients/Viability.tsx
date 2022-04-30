import React, { FunctionComponent } from "react";
import {
  RbcsActivitiesCard,
  ReportPageProps,
} from "@seasketch/geoprocessing/client-ui";
import ProtectionCardTwo from "./ProtectionCardTwo";
import SizeCardTwo from "./SizeCardTwo";
import BathymetryCard from "./BathymetryCard";
import FishingImpact from "./FishingImpact";
import GfwFishingEffort from "./GfwFishingEffort";

const ReportPage = () => {
  return (
    <>
      <ProtectionCardTwo />
      <SizeCardTwo />
      <BathymetryCard />
      <RbcsActivitiesCard />
      <GfwFishingEffort />
      <FishingImpact />
    </>
  );
};

export default ReportPage;
