import React from "react";
import { RbcsMpaObjective } from "./RbcsMpaObjective";
import { ReportDecorator, Card } from "@seasketch/geoprocessing/client-ui";
import { percentWithEdge } from "@seasketch/geoprocessing/client-core";
import { RbcsObjective } from "../types/objective";
import { YES_COUNT_OBJECTIVE, NO_COUNT_OBJECTIVE } from "../types/objective";

export default {
  component: RbcsMpaObjective,
  title: "Components/RbcsMpaObjective",
  decorators: [ReportDecorator],
};

const objective: RbcsObjective = {
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

export const simple = () => (
  <Card>
    <p>Based on the following objective {JSON.stringify(objective)}:</p>
    {Object.keys(objective.countsToward).map((level) => (
      <>
        <p>{`If MPA has protection level: ${level}`}</p>
        <RbcsMpaObjective level={level} objective={objective} />
      </>
    ))}
  </Card>
);

export const customMessageRenderProp = () => (
  <Card>
    <p>Based on the following objective {JSON.stringify(objective)}:</p>
    {Object.keys(objective.countsToward).map((level) => {
      const renderMsg = () => {
        if (objective.countsToward[level] === YES_COUNT_OBJECTIVE) {
          return (
            <>
              This most definitely counts towards protecting{" "}
              <b>{percentWithEdge(objective.target)}</b> of Lunar waters 🌙.
            </>
          );
        } else if (objective.countsToward[level] === NO_COUNT_OBJECTIVE) {
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
      return (
        <>
          <p>{`If MPA has protection level: ${level}`}</p>
          <RbcsMpaObjective
            level={level}
            objective={objective}
            renderMsg={renderMsg}
          />
        </>
      );
    })}
  </Card>
);
