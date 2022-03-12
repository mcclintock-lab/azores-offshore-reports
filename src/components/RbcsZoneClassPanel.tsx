import React from "react";
import { ZoneRegIcon } from "./RbcsIcons";
import { scores } from "mpa-reg-based-classification";
import { getZoneClassificationName } from "../helpers/mpaRegBasedClassification";

export interface RbcsPanelProps {
  value: number;
  size?: number;
}

/**
 * Single-sketch status panel for MPA regulation-based classification
 */
export const RbcsZoneClassPanel: React.FunctionComponent<RbcsPanelProps> = ({
  value,
  size = 24,
}) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        paddingBottom: 10,
      }}
    >
      <div style={{ paddingRight: 10 }}>
        <ZoneRegIcon value={value} size={size} />
      </div>
      <div style={{ fontSize: 18 }}>{getZoneClassificationName(value)}</div>
    </div>
  );
};
