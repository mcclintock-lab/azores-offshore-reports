import React from "react";
import { ReportDecorator, Card } from "@seasketch/geoprocessing/client-ui";
import { MpaRegIcon, ZoneRegIcon } from "./MpaRegIcons";

export default {
  component: MpaRegIcon,
  title: "Components/MpaRegIcon",
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
    <Card title="MpaRegIcon">
      <MpaRegIcon value={0} />
      <MpaRegIcon value={1.5} />
      <MpaRegIcon value={3.5} />
      <MpaRegIcon value={5} />
      <MpaRegIcon value={6.5} />
      <MpaRegIcon value={8.5} />
    </Card>
  </>
);
