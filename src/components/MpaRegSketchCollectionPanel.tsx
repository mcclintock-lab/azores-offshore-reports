import React from "react";
import { MpaRegIcon } from "./MpaRegIcons";

export interface MpaRegSketchCollectionPanelProps {
  value: number;
  displayName: string;
  size?: number;
  displayValue?: boolean;
}

/**
 * Sketch collection status panel for MPA regulation-based classification
 */
export const MpaRegSketchCollectionPanel: React.FunctionComponent<MpaRegSketchCollectionPanelProps> =
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
          <MpaRegIcon value={value} size={size} displayValue={displayValue} />
        </div>
        <div style={{ fontSize: 18 }}>{displayName}</div>
      </div>
    );
  };
