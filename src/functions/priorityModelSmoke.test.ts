/**
 * @group smoke
 * @jest-environment node
 */
import { priorityModel } from "./priorityModel";
import {
  getExamplePolygonSketchAll,
  writeResultOutput,
} from "@seasketch/geoprocessing/scripts/testing";

describe("priorityModelSmoke - Basic smoke tests", () => {
  test("handler function is present", () => {
    expect(typeof priorityModel).toBe("function");
  });
  test("tests run against all examples", async () => {
    const examples = await getExamplePolygonSketchAll();
    for (const example of examples) {
      const result = await priorityModel(example);
      expect(result).toBeTruthy();
      writeResultOutput(result, "priorityModel", example.properties.name);
    }
  }, 60000);
});
