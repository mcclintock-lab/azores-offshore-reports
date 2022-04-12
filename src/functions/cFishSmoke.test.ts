/**
 * @jest-environment node
 * @group smoke
 */
import handler from "./cFish";
import {
  getExamplePolygonSketchAll,
  writeResultOutput,
} from "@seasketch/geoprocessing/scripts/testing";

describe("Basic smoke tests", () => {
  test("handler function is present", () => {
    expect(typeof handler.func).toBe("function");
  });
  test("cFishSmoke - tests run against all examples", async () => {
    const examples = await getExamplePolygonSketchAll();
    for (const example of examples) {
      const result = await handler.func(example);
      expect(result).toBeTruthy();
      writeResultOutput(result, "cFish", example.properties.name);
    }
  }, 60000);
});
