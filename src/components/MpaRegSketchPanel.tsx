import React from "react";
import { ZoneRegIcon } from "./MpaRegIcons";
import { scores } from "mpa-reg-based-classification";

export interface MpaRegPanelProps {
  value: number;
  size?: number;
}

/**
 * Single-sketch status panel for MPA regulation-based classification
 */
export const MpaRegSketchPanel: React.FunctionComponent<MpaRegPanelProps> = ({
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
      <div style={{ fontSize: 18 }}>{scores[value].label}</div>
    </div>
  );
};
