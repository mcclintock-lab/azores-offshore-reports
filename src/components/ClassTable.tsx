import React from "react";
import {
  percentWithEdge,
  DataGroup,
  Metric,
  keyBy,
} from "@seasketch/geoprocessing/client-core";
import {
  Column,
  Table,
  LayerToggle,
  GreenPill,
  ReportTableStyled,
} from "@seasketch/geoprocessing/client-ui";
import { XCircleFill, CheckCircleFill } from "@styled-icons/bootstrap";
import { HorizontalStackedBar } from "./HorizontalStackedBar";

export interface ClassTableProps {
  /** Table row objects, each expected to have a classId and value. Defaults to "Class" */
  rows: Metric[];
  /** Data class definitions. if group has layerId at top-level, will display one toggle for whole group */
  dataGroup: DataGroup;
  /** Whether to format metric value and goal value as a percent.  Defaults to false */
  formatPerc?: boolean;
  /** Text to display for class name column.  Defaults to "Class" */
  titleText?: string;
  /** Whether to show map layer toggle column.  Data classes must have layerId defined */
  showLayerToggle?: boolean;
  /** Text to display for layer toggle column.  Defaults to "Show Map" */
  layerColText?: string;
  /** Whether to show goal column.  Data classes must have a goalValue defined. Defaults to false */
  showGoal?: boolean;
  /** Text to display for value column.  Defaults to "Within Plan" */
  valueColText?: string;
  /** Text to display for goal column.  Defaults to "Goal" */
  goalColText?: string;
  /** Override column widths */
  options?: {
    classColWidth?: string;
    percColWidth?: string;
    showMapWidth?: string;
    goalWidth?: string;
  };
}

/**
 * Table displaying class metrics, one class per table row
 */
export const ClassTable: React.FunctionComponent<ClassTableProps> = ({
  titleText = "Class",
  rows,
  dataGroup,
  formatPerc = false,
  valueColText = "Within Plan",
  showLayerToggle = false,
  layerColText = "Show Map",
  showGoal = false,
  goalColText = "Goal",
  options,
}) => {
  // Use user-defined width, otherwise sane default depending on whether goal
  const colWidths = {
    classColWidth: options?.classColWidth
      ? options?.classColWidth
      : showGoal
      ? "30%"
      : "50%",
    percColWidth: options?.percColWidth
      ? options?.percColWidth
      : showGoal
      ? "30%"
      : "30%",
    showMapWidth: options?.showMapWidth
      ? options?.showMapWidth
      : showGoal
      ? "20%"
      : "20%",
    goalWidth: options?.goalWidth
      ? options?.goalWidth
      : showGoal
      ? "20%"
      : "50%",
  };
  const classesByName = keyBy(
    dataGroup.classes,
    (curClass) => curClass.classId
  );
  const columns: Column<Metric>[] = [
    {
      Header: titleText,
      accessor: (row) =>
        classesByName[row.classId || "missing"]?.display || "missing",
      style: { width: colWidths.classColWidth },
    },
    {
      Header: valueColText,
      style: { textAlign: "center", width: colWidths.percColWidth },
      accessor: (row) => {
        const valueDisplay = formatPerc
          ? percentWithEdge(row.value)
          : row.value;
        // @ts-ignore: need to add objective to type
        const goal = dataGroup.objective.target * 100 || 0;

        const chartAllConfig = {
          rows: [[[row.value * 100]]],
          rowConfigs: [
            {
              title: (value: number) => (
                <>
                  {value >= goal && (
                    <CheckCircleFill
                      size={14}
                      style={{ color: "#78c679", paddingRight: 5 }}
                    />
                  )}
                  {percentWithEdge(value / 100)}
                </>
              ),
            },
          ],
          max: 100,
        };

        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ flex: 1 }}>
              <HorizontalStackedBar
                {...chartAllConfig}
                blockGroupNames={["foo"]}
                blockGroupStyles={[{ backgroundColor: "#ddd" }]}
                showTitle={true}
                showLegend={false}
                showTargetLabel={false}
                showTotalLabel={false}
                barHeight={20}
                target={goal}
              />
            </div>
          </div>
        );
      },
    },
  ];

  // Optionally insert layer toggle column
  if (showLayerToggle) {
    columns.push({
      Header: layerColText,
      accessor: (row, index) => {
        const isSimpleGroup = dataGroup.layerId ? false : true;
        const layerId =
          dataGroup.layerId || classesByName[row.classId!].layerId;
        if (isSimpleGroup && layerId) {
          return (
            <LayerToggle
              simple
              layerId={layerId}
              style={{ marginTop: 0, marginLeft: 15 }}
            />
          );
        } else if (!isSimpleGroup && layerId && index === 0) {
          return (
            <LayerToggle
              simple
              layerId={layerId}
              style={{ marginTop: 0, marginLeft: 15 }}
            />
          );
        } else {
          return <></>;
        }
      },
      style: { width: colWidths.showMapWidth },
    });
  }

  // Optionally insert goal column
  if (showGoal) {
    columns.splice(columns.length - (showLayerToggle ? 1 : 0), 0, {
      Header: goalColText,
      style: { textAlign: "right", width: colWidths.goalWidth },
      accessor: (row) => {
        const goalValue = dataGroup.classes.find(
          (curClass) => curClass.classId === row.classId
        )?.goalValue;
        if (!goalValue)
          throw new Error(`Goal value not found for ${row.classId}`);
        return formatPerc ? percentWithEdge(goalValue) : goalValue;
      },
    });
  }

  return (
    <ReportTableStyled>
      <Table className="styled" columns={columns} data={rows} />
    </ReportTableStyled>
  );
};
