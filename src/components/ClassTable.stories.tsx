import React from "react";
import { ClassTable, ClassTableColumnConfig } from "./ClassTable";
import {
  ReportContext,
  ReportDecorator,
  CardDecorator,
} from "@seasketch/geoprocessing/client-ui";
import {
  simpleClassMetrics,
  simpleGroup,
  simpleMetricGroup,
  categoricalClassMetrics,
  categoricalMetricGroup,
} from "@seasketch/geoprocessing/src/testing/fixtures/metrics";

export default {
  component: ClassTable,
  title: "Components/Table/ClassTablez",
  decorators: [CardDecorator, ReportDecorator],
};

const simpleContext = {
  sketchProperties: {
    name: "My Sketch",
    id: "abc123",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sketchClassId: "efg345",
    isCollection: false,
    userAttributes: [
      {
        exportId: "DESIGNATION",
        fieldType: "ChoiceField",
        label: "Designation",
        value: "Marine Reserve",
      },
      {
        exportId: "COMMENTS",
        fieldType: "TextArea",
        label: "Comments",
        value: "This is my MPA and it is going to be the greatest. Amazing.",
      },
    ],
  },
  geometryUri: "",
  projectUrl: "https://example.com/project",
  visibleLayers: ["a"],
};

export const simple = () => {
  return (
    <ReportContext.Provider value={simpleContext}>
      <ClassTable
        rows={simpleClassMetrics}
        dataGroup={simpleGroup}
        columnConfig={[
          {
            type: "class",
          },
          {
            type: "metricValue",
            metricId: simpleMetricGroup.metricId,
          },
        ]}
      />
    </ReportContext.Provider>
  );
};

export const simpleLayerToggle = () => {
  return (
    <ReportContext.Provider value={simpleContext}>
      <ClassTable
        rows={simpleClassMetrics}
        dataGroup={simpleMetricGroup}
        columnConfig={[
          {
            type: "class",
          },
          {
            type: "metricValue",
            metricId: simpleMetricGroup.metricId,
            valueFormatter: "percent",
            columnLabel: "% Value",
          },
          {
            type: "layerToggle",
          },
        ]}
      />
    </ReportContext.Provider>
  );
};

export const simpleGoal = () => {
  return (
    <ReportContext.Provider value={simpleContext}>
      <ClassTable
        rows={simpleClassMetrics}
        dataGroup={simpleMetricGroup}
        columnConfig={[
          {
            type: "class",
          },
          {
            type: "metricValue",
            metricId: simpleMetricGroup.metricId,
            valueFormatter: "percent",
            columnLabel: "% Value",
          },
          {
            type: "metricGoal",
            valueFormatter: "percent",
          },
        ]}
      />
    </ReportContext.Provider>
  );
};

export const simpleBoth = () => {
  return (
    <ReportContext.Provider value={simpleContext}>
      <ClassTable
        rows={simpleClassMetrics}
        dataGroup={simpleMetricGroup}
        columnConfig={[
          {
            type: "class",
          },
          {
            type: "metricValue",
            metricId: simpleMetricGroup.metricId,
            valueFormatter: "percent",
            columnLabel: "% Value",
          },
          {
            type: "metricGoal",
            valueFormatter: "percent",
          },
          {
            type: "layerToggle",
          },
        ]}
      />
    </ReportContext.Provider>
  );
};

export const categoricalData = () => {
  return (
    <ReportContext.Provider value={simpleContext}>
      <ClassTable
        rows={categoricalClassMetrics}
        dataGroup={categoricalMetricGroup}
        columnConfig={[
          {
            type: "class",
          },
          {
            type: "metricValue",
            metricId: simpleMetricGroup.metricId,
            valueFormatter: "percent",
            columnLabel: "% Value",
          },
          {
            type: "metricGoal",
            valueFormatter: "percent",
          },
          {
            type: "layerToggle",
          },
        ]}
      />
    </ReportContext.Provider>
  );
};

export const valueFormatAndLabel = () => {
  return (
    <ReportContext.Provider value={simpleContext}>
      <ClassTable
        rows={categoricalClassMetrics}
        dataGroup={categoricalMetricGroup}
        columnConfig={[
          {
            type: "class",
          },
          {
            type: "metricValue",
            metricId: simpleMetricGroup.metricId,
            valueFormatter: (val: string | number) =>
              (typeof val === "string" ? parseFloat(val) : val) * 1000,
            valueLabel: "ideas",
          },
        ]}
      />
    </ReportContext.Provider>
  );
};

export const chart = () => {
  return (
    <ReportContext.Provider value={simpleContext}>
      <ClassTable
        rows={categoricalClassMetrics}
        dataGroup={categoricalMetricGroup}
        columnConfig={[
          {
            type: "class",
            width: 30,
          },
          {
            type: "metricValue",
            metricId: simpleMetricGroup.metricId,
            valueFormatter: "percent",
            width: 15,
            colStyle: { textAlign: "right" },
            columnLabel: " ",
          },
          {
            type: "metricChart",
            metricId: simpleMetricGroup.metricId,
            valueFormatter: "percent",
            columnLabel: "Within plan",
            chartOptions: {
              showTitle: false,
            },
            width: 55,
          },
        ]}
      />
    </ReportContext.Provider>
  );
};

export const chartWithTarget = () => {
  return (
    <ReportContext.Provider value={simpleContext}>
      <ClassTable
        rows={categoricalClassMetrics}
        dataGroup={{
          ...categoricalMetricGroup,
          // @ts-ignore
          objective: { target: 0.3 },
        }}
        columnConfig={[
          {
            type: "class",
            width: 30,
          },
          {
            type: "metricValue",
            metricId: simpleMetricGroup.metricId,
            valueFormatter: "percent",
            width: 15,
            colStyle: { textAlign: "right" },
            columnLabel: "Within Plan",
          },
          {
            type: "metricChart",
            metricId: simpleMetricGroup.metricId,
            valueFormatter: "percent",
            chartOptions: {
              showTitle: false,
            },
            width: 55,
          },
        ]}
      />
    </ReportContext.Provider>
  );
};
