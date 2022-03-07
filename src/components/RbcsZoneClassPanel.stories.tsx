import React from "react";
import { ReportDecorator, Card } from "@seasketch/geoprocessing/client-ui";
import { RbcsZoneClassPanel } from "./RbcsZoneClassPanel";

export default {
  component: RbcsZoneClassPanel,
  title: "Components/RbcsZoneClassPanel",
  decorators: [ReportDecorator],
};

export const simple = () => (
  <>
    <Card title="RBCS Zone Classification">
      {Array.from({ length: 8 }, (v, i) => (
        <RbcsZoneClassPanel value={i + 1} />
      ))}
    </Card>
  </>
);
