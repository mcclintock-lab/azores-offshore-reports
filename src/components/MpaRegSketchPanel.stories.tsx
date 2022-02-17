import React from "react";
import { ReportDecorator, Card } from "@seasketch/geoprocessing/client-ui";
import { MpaRegSketchPanel } from "./MpaRegSketchPanel";

export default {
  component: MpaRegSketchPanel,
  title: "Components/MpaRegSketchPanel",
  decorators: [ReportDecorator],
};

export const simple = () => (
  <>
    <Card title="Zone Classification">
      {Array.from({ length: 8 }, (v, i) => (
        <MpaRegSketchPanel value={i + 1} />
      ))}
    </Card>
  </>
);
