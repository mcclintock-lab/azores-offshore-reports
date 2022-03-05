import React from "react";
import { ReportDecorator, Card } from "@seasketch/geoprocessing/client-ui";
import { RbcsMpaClassPanel } from "./RbcsMpaClassPanel";
import { getClassificationLabel } from "../helpers/mpaRegBasedClassification";

export default {
  component: RbcsMpaClassPanel,
  title: "Components/RbcsMpaClassPanel",
  decorators: [ReportDecorator],
};

const values = [1.25, 2.35, 3.65, 4.15, 5.85, 6.35, 7.15];

export const simple = () => (
  <Card title="Network Zone Classification">
    {values.map((value) => (
      <RbcsMpaClassPanel
        value={value}
        displayName={getClassificationLabel(value)}
      />
    ))}
  </Card>
);
