import React from "react";
import {
  RbcsObjective,
  isRbcsObjectiveKey,
  YES_COUNT_OBJECTIVE,
  NO_COUNT_OBJECTIVE,
} from "../types/objective";
import { percentWithEdge } from "@seasketch/geoprocessing/client-core";
import { ObjectiveStatus } from "./ObjectiveStatus";

export interface RbcsObjectiveProps {
  curObjectiveValue: string;
  objective: RbcsObjective;
}

export const RbcsMpaObjective: React.FunctionComponent<RbcsObjectiveProps> = ({
  curObjectiveValue,
  objective,
}) => {
  if (isRbcsObjectiveKey(curObjectiveValue)) {
    console.log("curObjectiveValue", curObjectiveValue);
    const msg = (() => {
      if (objective.countsToward[curObjectiveValue] === YES_COUNT_OBJECTIVE) {
        return (
          <>
            This MPA meets the objective of fully protecting{" "}
            <b>{percentWithEdge(objective.target)}</b> of Azorean waters.
          </>
        );
      } else if (
        objective.countsToward[curObjectiveValue] === NO_COUNT_OBJECTIVE
      ) {
        return (
          <>
            This MPA <b>does not</b> meet the objective of fully protecting{" "}
            <b>{percentWithEdge(objective.target)}</b> of Azorean waters.
          </>
        );
      } else {
        return (
          <>
            This MPA <b>may</b> meet the objective of fully protecting{" "}
            <b>{percentWithEdge(objective.target)}</b> of Azorean waters.
          </>
        );
      }
    })();

    return (
      <ObjectiveStatus
        status={objective.countsToward[curObjectiveValue]}
        msg={msg}
      />
    );
  } else {
    throw new Error(`Invalid objective status, ${curObjectiveValue}`);
  }
};
