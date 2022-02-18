import React from "react";
import { SketchAttributesCard } from "@seasketch/geoprocessing/client-ui";
import { constants } from "mpa-reg-based-classification";

export const MpaRegActivitiesCard = () => {
  const mappings = {
    GEAR_TYPES: constants.GEAR_TYPES,
    AQUACULTURE: constants.AQUACULTURE_AND_BOTTOM_EXPLOITATION,
    BOATING: constants.BOATING_AND_ANCHORING,
  };

  return <SketchAttributesCard autoHide={true} mappings={mappings} />;
};

export default MpaRegActivitiesCard;
