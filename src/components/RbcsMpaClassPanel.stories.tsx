import React from "react";
import { ReportDecorator, Card } from "@seasketch/geoprocessing/client-ui";
import { RbcsMpaClassPanel } from "./RbcsMpaClassPanel";
import { getProtectionLevel } from "../helpers/mpaRegBasedClassification";

export default {
  component: RbcsMpaClassPanel,
  title: "Components/RbcsMpaClassPanel",
  decorators: [ReportDecorator],
};

const values = [1.25, 2.35, 3.65, 4.15, 5.85, 6.35, 7.15];

export const simple = () => (
  <Card title="RBCS MPA Classification">
    {values.map((value) => (
      <>
        <p>If MPA has index value: {value}</p>
        <RbcsMpaClassPanel
          value={value}
          displayName={getProtectionLevel(value)}
        />
      </>
    ))}
  </Card>
);
