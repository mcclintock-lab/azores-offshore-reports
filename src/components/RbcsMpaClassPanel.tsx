import React from "react";
import { RbcsIcon } from "./RbcsIcons";

export interface RbcsMpaClassPanelProps {
  value: number;
  displayName: string;
  size?: number;
  displayValue?: boolean;
}

/**
 * Sketch collection status panel for MPA regulation-based classification
 */
export const RbcsMpaClassPanel: React.FunctionComponent<RbcsMpaClassPanelProps> =
  ({ value, displayName, size, displayValue = true }) => {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          paddingBottom: 10,
        }}
      >
        <div style={{ paddingRight: 10 }}>
          <RbcsIcon value={value} size={size} displayValue={displayValue} />
        </div>
        <div style={{ fontSize: 18 }}>{displayName}</div>
      </div>
    );
  };
