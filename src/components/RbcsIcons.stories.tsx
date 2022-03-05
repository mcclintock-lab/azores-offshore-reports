import React from "react";
import { ReportDecorator, Card } from "@seasketch/geoprocessing/client-ui";
import { RbcsIcon, ZoneRegIcon } from "./RbcsIcons";

export default {
  component: RbcsIcon,
  title: "Components/RbcsIcon",
  decorators: [ReportDecorator],
};

export const simple = () => (
  <>
    <Card title="ZoneRegIcon">
      <ZoneRegIcon value={1} />
      <ZoneRegIcon value={2} />
      <ZoneRegIcon value={3} />
      <ZoneRegIcon value={4} />
      <ZoneRegIcon value={5} />
      <ZoneRegIcon value={6} />
      <ZoneRegIcon value={7} />
      <ZoneRegIcon value={8} />
    </Card>
    <Card title="RbcsIcon">
      <RbcsIcon value={0} />
      <RbcsIcon value={1.5} />
      <RbcsIcon value={3.5} />
      <RbcsIcon value={5} />
      <RbcsIcon value={6.5} />
      <RbcsIcon value={8.5} />
    </Card>
  </>
);
