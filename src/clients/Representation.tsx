import React from "react";
import { ReportPage } from "@seasketch/geoprocessing/client-ui";
import BenthicHabitat from "./BenthicHabitat";
import EssentialHabitat from "./EssentialHabitat";

const Representation = () => {
  return (
    <ReportPage hidden={false}>
      <BenthicHabitat />
      <EssentialHabitat />
    </ReportPage>
  );
};

export default Representation;
