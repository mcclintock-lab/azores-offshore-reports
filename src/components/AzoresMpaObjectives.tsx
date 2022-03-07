import React from "react";
import { RbcsMpaObjectiveStatus } from "./RbcsMpaObjectiveStatus";
import {
  YES_COUNT_OBJECTIVE,
  NO_COUNT_OBJECTIVE,
  RbcsMpaProtectionLevel,
  RbcsObjective,
} from "../types/objective";
import { ProjectObjectives } from "../_config";
import { percentWithEdge } from "@seasketch/geoprocessing/client-core";

/** Custom msg render for eez objective */
const renderEezMsg = (
  objective: RbcsObjective,
  level: RbcsMpaProtectionLevel
) => {
  if (objective.countsToward[level] === YES_COUNT_OBJECTIVE) {
    return (
      <>
        This MPA counts towards protecting{" "}
        <b>{percentWithEdge(objective.target)}</b> of Azorean waters.
      </>
    );
  } else if (objective.countsToward[level] === NO_COUNT_OBJECTIVE) {
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
};

/** Custom msg render for eez no-take objective */
const renderEezNoTakeMsg = (
  objective: RbcsObjective,
  level: RbcsMpaProtectionLevel
) => {
  if (objective.countsToward[level] === YES_COUNT_OBJECTIVE) {
    return (
      <>
        This MPA counts towards fully protecting{" "}
        <b>{percentWithEdge(objective.target)}</b> of Azorean waters as no-take.
      </>
    );
  } else if (objective.countsToward[level] === NO_COUNT_OBJECTIVE) {
    return (
      <>
        This MPA <b>does not</b> count towards fully protecting{" "}
        <b>{percentWithEdge(objective.target)}</b> of Azorean waters as no-take.
      </>
    );
  } else {
    return (
      <>
        This MPA <b>may</b> count towards fully protecting{" "}
        <b>{percentWithEdge(objective.target)}</b> of Azorean waters as no-take.
      </>
    );
  }
};

export interface AzoresMpaObjectivesProps {
  objectives: ProjectObjectives;
  level: RbcsMpaProtectionLevel;
}

export const AzoresMpaObjectives: React.FunctionComponent<AzoresMpaObjectivesProps> =
  ({ objectives, level }) => {
    return (
      <>
        <RbcsMpaObjectiveStatus
          level={level}
          objective={objectives.eez}
          renderMsg={() => renderEezMsg(objectives.eez, level)}
        />
        <RbcsMpaObjectiveStatus
          level={level}
          objective={objectives.eezNoTake}
          renderMsg={() => renderEezNoTakeMsg(objectives.eez, level)}
        />
      </>
    );
  };
