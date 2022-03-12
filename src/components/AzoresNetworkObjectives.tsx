import React from "react";
import {
  OBJECTIVE_YES,
  OBJECTIVE_NO,
  RbcsObjective,
  ObjectiveAnswer,
} from "../types/objective";
import { isProjectObjectiveId, ProjectObjectiveId } from "../_config";
import { percentWithEdge } from "@seasketch/geoprocessing/client-core";
import { ObjectiveStatus } from "./ObjectiveStatus";
import { RbcsNetworkObjectiveStatus } from "./RbcsNetworkObjectiveStatus";

export type RenderMsgFunction = (
  objective: RbcsObjective,
  objectiveMet: ObjectiveAnswer
) => JSX.Element;

/** Custom msg render for objectives */
const msgs: Record<ProjectObjectiveId, RenderMsgFunction> = {
  eez: (objective: RbcsObjective, objectiveMet: ObjectiveAnswer) => {
    if (objectiveMet === OBJECTIVE_YES) {
      return (
        <>
          This plan meets the objective of protecting{" "}
          <b>{percentWithEdge(objective.target)}</b> of Azorean waters.
        </>
      );
    } else if (objectiveMet === OBJECTIVE_NO) {
      return (
        <>
          This plan <b>does not</b> meet the objective of protecting{" "}
          <b>{percentWithEdge(objective.target)}</b> of Azorean waters.
        </>
      );
    } else {
      return (
        <>
          This plan <b>may</b> meet the objective of protecting{" "}
          <b>{percentWithEdge(objective.target)}</b> of Azorean waters.
        </>
      );
    }
  },
  eezNoTake: (objective: RbcsObjective, objectiveMet: ObjectiveAnswer) => {
    if (objectiveMet === OBJECTIVE_YES) {
      return (
        <>
          This plan meets the objective of fully protecting{" "}
          <b>{percentWithEdge(objective.target)}</b> of Azorean waters as
          no-take.
        </>
      );
    } else if (objectiveMet === OBJECTIVE_NO) {
      return (
        <>
          This plan <b>does not</b> meet the objective of fully protecting{" "}
          <b>{percentWithEdge(objective.target)}</b> of Azorean waters as
          no-take.
        </>
      );
    } else {
      return (
        <>
          This plan <b>may</b> meet the objective of fully protecting{" "}
          <b>{percentWithEdge(objective.target)}</b> of Azorean waters as
          no-take.
        </>
      );
    }
  },
};

export interface AzoresNetworkObjectiveProps {
  /** Objective to display status */
  objective: RbcsObjective;
  /** Answer to whether objective is met */
  objectiveMet: ObjectiveAnswer;
}

/**
 * Displays status toward meeting Network objective
 */
export const AzoresNetworkObjectiveStatus: React.FunctionComponent<AzoresNetworkObjectiveProps> =
  ({ objective, objectiveMet }) => {
    const objectiveId = (() => {
      if (isProjectObjectiveId(objective.id)) {
        return objective.id;
      } else {
        throw new Error("Not a valid objective ID");
      }
    })();

    return (
      <>
        <RbcsNetworkObjectiveStatus
          objective={objective}
          objectiveMet={objectiveMet}
          renderMsg={() => msgs[objectiveId](objective, objectiveMet)}
        />
      </>
    );
  };
