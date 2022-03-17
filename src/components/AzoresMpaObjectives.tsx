import React from "react";
import {
  RbcsMpaObjectiveStatus,
  RenderMsgFunction,
} from "./RbcsMpaObjectiveStatus";
import {
  OBJECTIVE_YES,
  OBJECTIVE_NO,
  RbcsMpaProtectionLevel,
  RbcsObjective,
} from "../types/objective";
import { ProjectObjectives, ProjectSizeObjectiveId } from "../_config";
import { percentWithEdge } from "@seasketch/geoprocessing/client-core";
import { getKeys } from "../helpers/ts";

/** Custom msg render for eez objective */
const msgs: Record<ProjectSizeObjectiveId, RenderMsgFunction> = {
  eez: (objective: RbcsObjective, level: RbcsMpaProtectionLevel) => {
    if (objective.countsToward[level] === OBJECTIVE_YES) {
      return (
        <>
          This MPA counts towards protecting{" "}
          <b>{percentWithEdge(objective.target)}</b> of Azorean waters.
        </>
      );
    } else if (objective.countsToward[level] === OBJECTIVE_NO) {
      return (
        <>
          This MPA <b>does not</b> count towards protecting{" "}
          <b>{percentWithEdge(objective.target)}</b> of Azorean waters.
        </>
      );
    } else {
      return (
        <>
          This MPA <b>may</b> count towards protecting{" "}
          <b>{percentWithEdge(objective.target)}</b> of Azorean waters.
        </>
      );
    }
  },
  eezNoTake: (objective: RbcsObjective, level: RbcsMpaProtectionLevel) => {
    if (objective.countsToward[level] === OBJECTIVE_YES) {
      return (
        <>
          This MPA counts towards fully protecting{" "}
          <b>{percentWithEdge(objective.target)}</b> of Azorean waters as
          no-take.
        </>
      );
    } else if (objective.countsToward[level] === OBJECTIVE_NO) {
      return (
        <>
          This MPA <b>does not</b> count towards fully protecting{" "}
          <b>{percentWithEdge(objective.target)}</b> of Azorean waters as
          no-take.
        </>
      );
    } else {
      return (
        <>
          This MPA <b>may</b> count towards fully protecting{" "}
          <b>{percentWithEdge(objective.target)}</b> of Azorean waters as
          no-take.
        </>
      );
    }
  },
};

export interface AzoresMpaObjectivesProps {
  objectives: ProjectObjectives;
  level: RbcsMpaProtectionLevel;
}

export const AzoresMpaObjectives: React.FunctionComponent<AzoresMpaObjectivesProps> =
  ({ objectives, level }) => {
    return (
      <>
        {getKeys(msgs).map((objectiveId) => (
          <RbcsMpaObjectiveStatus
            level={level}
            objective={objectives[objectiveId]}
            renderMsg={() => msgs[objectiveId](objectives[objectiveId], level)}
          />
        ))}
      </>
    );
  };
