import React from "react";
import { ReportDecorator, Card } from "@seasketch/geoprocessing/client-ui";
import { MpaRegSketchCollectionPanel } from "./MpaRegSketchCollectionPanel";
import { getClassificationLabel } from "../helpers/mpaRegBasedClassification";

export default {
  component: MpaRegSketchCollectionPanel,
  title: "Components/MpaRegSketchCollectionPanel",
  decorators: [ReportDecorator],
};

const values = [1.25, 2.35, 3.65, 4.15, 5.85, 6.35, 7.15];

export const simple = () => (
  <Card title="Network Zone Classification">
    {values.map((value) => (
      <MpaRegSketchCollectionPanel
        value={value}
        displayName={getClassificationLabel(value)}
      />
    ))}
  </Card>
);
