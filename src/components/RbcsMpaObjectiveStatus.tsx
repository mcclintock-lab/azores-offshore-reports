import React from "react";
import {
  RbcsObjective,
  YES_COUNT_OBJECTIVE,
  NO_COUNT_OBJECTIVE,
  RbcsMpaProtectionLevel,
} from "../types/objective";
import { percentWithEdge } from "@seasketch/geoprocessing/client-core";
import { ObjectiveStatus } from "./ObjectiveStatus";

export interface RbcsMpaObjectiveStatusProps {
  /** RBCS protection level for MPA to give status for */
  level: RbcsMpaProtectionLevel;
  /** RBCS objective to weigh protection level against */
  objective: RbcsObjective;
  /** optional custom objective message */
  renderMsg?: (
    objective: RbcsObjective,
    level: RbcsMpaProtectionLevel
  ) => JSX.Element;
}

export const RbcsMpaObjectiveStatus: React.FunctionComponent<RbcsMpaObjectiveStatusProps> =
  ({ level, objective, renderMsg }) => {
    const msg = renderMsg
      ? renderMsg(objective, level)
      : defaultMsg(objective, level);

    return <ObjectiveStatus status={objective.countsToward[level]} msg={msg} />;
  };

const defaultMsg = (
  objective: RbcsObjective,
  level: RbcsMpaProtectionLevel
) => {
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
