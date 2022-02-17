import React from "react";
import { PointyCircle, TwoColorPointyCircle } from "../components/PointyCircle";
import { ReportDecorator, Card } from "@seasketch/geoprocessing/client-ui";

export default {
  component: PointyCircle,
  title: "Components/PointyCircle",
  decorators: [ReportDecorator],
};

export const simple = () => (
  <Card title="Card Title">
    <PointyCircle>5</PointyCircle>
    <PointyCircle color="red">R</PointyCircle>
    <PointyCircle color="blue">B</PointyCircle>
  </Card>
);

export const twoColor = () => (
  <Card title="Card Title">
    <TwoColorPointyCircle perc={0}>0</TwoColorPointyCircle>
    <TwoColorPointyCircle perc={50}>50</TwoColorPointyCircle>
    <TwoColorPointyCircle perc={100}>100</TwoColorPointyCircle>
    <TwoColorPointyCircle topColor="red" bottomColor="blue" perc={20}>
      20
    </TwoColorPointyCircle>
    <TwoColorPointyCircle topColor="red" bottomColor="blue" perc={60}>
      60
    </TwoColorPointyCircle>
  </Card>
);
