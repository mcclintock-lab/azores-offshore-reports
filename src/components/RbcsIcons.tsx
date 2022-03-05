import React from "react";
import { PointyCircle, TwoColorPointyCircle } from "./PointyCircle";
import { getIndexIconPerc } from "../helpers/mpaRegBasedClassification";
import { roundDecimal } from "@seasketch/geoprocessing/client-core";
import { scores } from "mpa-reg-based-classification";

export interface RbcsIconProps {
  value: number;
  size?: number;
  displayValue?: boolean;
}

export const ZoneRegIcon: React.FunctionComponent<RbcsIconProps> = ({
  value,
  size = 20,
  displayValue = true,
}) => {
  if (
    value !== 1 &&
    value !== 2 &&
    value !== 3 &&
    value !== 4 &&
    value !== 5 &&
    value !== 6 &&
    value !== 7 &&
    value !== 8
  )
    throw new Error("ZoneRegIcon: value must be integer 1-8");
  return (
    <PointyCircle size={size || 20} color={scores[value].color}>
      {displayValue ? value : "'"}
    </PointyCircle>
  );
};

export const RbcsIcon: React.FunctionComponent<RbcsIconProps> = ({
  value,
  size = 30,
  displayValue = true,
}) => {
  return (
    <TwoColorPointyCircle
      size={size}
      bottomColor={"rgb(208,214,55)"}
      topColor={"rgb(137,26,34)"}
      perc={100 - getIndexIconPerc(value)}
    >
      {displayValue ? roundDecimal(value, 1) : ""}
    </TwoColorPointyCircle>
  );
};
