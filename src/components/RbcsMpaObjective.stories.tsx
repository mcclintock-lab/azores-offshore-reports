import React from "react";
import { RbcsMpaObjective } from "./RbcsMpaObjective";
import { ReportDecorator, Card } from "@seasketch/geoprocessing/client-ui";
import { RbcsObjective } from "../types/objective";
import { getClassificationLabel } from "../helpers/mpaRegBasedClassification";

export default {
  component: RbcsMpaObjective,
  title: "Components/RbcsMpaObjective",
  decorators: [ReportDecorator],
};

const objective: RbcsObjective = {
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
  <Card title="Report Title">
    <p>Based on the following objective {JSON.stringify(objective)}:</p>
    {Object.keys(objective.countsToward).map((level) => (
      <>
        <p>{`If MPA has protection level: ${level}`}</p>
        <RbcsMpaObjective curObjectiveValue={level} objective={objective} />
      </>
    ))}
  </Card>
);
