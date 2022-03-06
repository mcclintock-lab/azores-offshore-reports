import React from "react";
import { ObjectiveStatus } from "./ObjectiveStatus";
import { ReportDecorator, Card } from "@seasketch/geoprocessing/client-ui";

export default {
  component: ObjectiveStatus,
  title: "Components/ObjectiveStatus",
  decorators: [ReportDecorator],
};

export const yes = () => (
  <Card title="Report Title">
    <ObjectiveStatus
      status="yes"
      msg={
        <>
          This MPA meets the objective of protecting <b>20%</b>
          of key habitat
        </>
      }
    />
  </Card>
);

export const no = () => (
  <Card title="Report Title">
    <ObjectiveStatus
      status="no"
      msg={
        <>
          This MPA meets the objective of protecting <b>20%</b>
          of key habitat
        </>
      }
    />
  </Card>
);

export const maybe = () => (
  <Card title="Report Title">
    <ObjectiveStatus
      status="maybe"
      msg={
        <>
          This MPA meets the objective of protecting <b>20%</b>
          of key habitat
        </>
      }
    />
  </Card>
);
