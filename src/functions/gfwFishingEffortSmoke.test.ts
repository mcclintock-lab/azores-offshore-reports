/**
 * @jest-environment node
 * @group smoke
 */
import { gfwFishingEffort } from "./gfwFishingEffort";
import {
  getExamplePolygonSketchAll,
  writeResultOutput,
} from "@seasketch/geoprocessing/scripts/testing";

describe("Basic smoke tests", () => {
  test("handler function is present", () => {
    expect(typeof gfwFishingEffort).toBe("function");
  });
  test("gfwFishingEffortSmoke - tests run against all examples", async () => {
    const examples = await getExamplePolygonSketchAll();
    for (const example of examples) {
      const result = await gfwFishingEffort(example);
      expect(result).toBeTruthy();
      writeResultOutput(result, "gfwFishingEffort", example.properties.name);
    }
  }, 60000);
});
