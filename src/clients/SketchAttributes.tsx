import React from "react";
import {
  SketchAttributesCard,
} from "@seasketch/geoprocessing/client-ui";

const Number = new Intl.NumberFormat("en", { style: "decimal" });

const SketchAttributes = () => {
  return (
    <SketchAttributesCard autoHide={true} />
  );
};

export default SketchAttributes;
