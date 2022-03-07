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
  level: string;
  objective: RbcsObjective;
  /** Optional renderProp for  */
  renderMsg?: () => React.ReactElement;
}

export const RbcsMpaObjective: React.FunctionComponent<RbcsObjectiveProps> = ({
  level: level,
  objective,
  renderMsg,
}) => {
  if (isRbcsObjectiveKey(level)) {
    const msg = renderMsg ? renderMsg() : defaultMsg(level, objective);

    return <ObjectiveStatus status={objective.countsToward[level]} msg={msg} />;
  } else {
    throw new Error(`Invalid objective status, ${level}`);
  }
};

const defaultMsg = (level: string, objective: RbcsObjective) => {
  if (objective.countsToward[level] === YES_COUNT_OBJECTIVE) {
    return (
      <>
        This MPA counts towards protecting{" "}
        <b>{percentWithEdge(objective.target)}</b> of planning area.
      </>
    );
  } else if (objective.countsToward[level] === NO_COUNT_OBJECTIVE) {
    return (
      <>
        This MPA <b>does not</b> count towards protecting{" "}
        <b>{percentWithEdge(objective.target)}</b> of planning area.
      </>
    );
  } else {
    return (
      <>
        This MPA <b>may</b> count towards protecting{" "}
        <b>{percentWithEdge(objective.target)}</b> of planning area.
      </>
    );
  }
};
