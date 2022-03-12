import React from "react";
import { RbcsMpaObjectiveStatus } from "./RbcsMpaObjectiveStatus";
import { ReportDecorator, Card } from "@seasketch/geoprocessing/client-ui";
import { percentWithEdge } from "@seasketch/geoprocessing/client-core";
import { RbcsObjective, RbcsMpaProtectionLevel } from "../types/objective";
import { OBJECTIVE_YES, OBJECTIVE_NO } from "../types/objective";
import { getKeys } from "../helpers/ts";

export default {
  component: RbcsMpaObjectiveStatus,
  title: "Components/RbcsMpaObjective",
  decorators: [ReportDecorator],
};

const objective: RbcsObjective = {
  id: "eez",
  shortDesc: "30% protected",
  target: 0.3,
  countsToward: {
    "Fully Protected Area": "yes",
    "Highly Protected Area": "yes",
    "Moderately Protected Area": "maybe",
    "Poorly Protected Area": "no",
    "Unprotected Area": "no",
  },
};

export const simple = () => {
  const levels = getKeys(objective.countsToward);
  return (
    <Card>
      <p>Based on the following objective {JSON.stringify(objective)}:</p>
      {levels.map((level) => (
        <>
          <p>{`If MPA has protection level: ${level}`}</p>
          <RbcsMpaObjectiveStatus level={level} objective={objective} />
        </>
      ))}
    </Card>
  );
};

export const customMessageRenderProp = () => {
  const levels = getKeys(objective.countsToward);
  return (
    <Card>
      <p>Based on the following objective {JSON.stringify(objective)}:</p>
      {levels.map((level) => (
        <>
          <p>{`If MPA has protection level: ${level}`}</p>
          <RbcsMpaObjectiveStatus
            level={level}
            objective={objective}
            renderMsg={() => customRenderMsg(objective, level)}
          />
        </>
      ))}
    </Card>
  );
};

const customRenderMsg = (
  objective: RbcsObjective,
  level: RbcsMpaProtectionLevel
) => {
  if (objective.countsToward[level] === OBJECTIVE_YES) {
    return (
      <>
        This most definitely counts towards protecting{" "}
        <b>{percentWithEdge(objective.target)}</b> of Lunar waters 🌙.
      </>
    );
  } else if (objective.countsToward[level] === OBJECTIVE_NO) {
    return (
      <>
        This most definitely <b>does not</b> count towards protecting{" "}
        <b>{percentWithEdge(objective.target)}</b> of Lunar waters 🌙.
      </>
    );
  } else {
    return (
      <>
        This most definitely <b>may</b> count towards protecting{" "}
        <b>{percentWithEdge(objective.target)}</b> of Lunar waters 🌙.
      </>
    );
  }
};
