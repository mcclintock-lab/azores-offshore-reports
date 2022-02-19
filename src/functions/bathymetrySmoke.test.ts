/**
 * @jest-environment node
 * @group smoke
 */
import { bathymetry } from "./bathymetry";
import {
  getExamplePolygonSketchAll,
  writeResultOutput,
} from "@seasketch/geoprocessing/scripts/testing";

describe("bathymetry smoke tests", () => {
  it("has a handler function", () => {
    expect(typeof bathymetry).toBe("function");
  });
  it("find bathymetry for all types", async () => {
    const examples = await getExamplePolygonSketchAll();
    for (const example of examples) {
      const result = await bathymetry(example);
      expect(result).toBeTruthy();
      expect(result.min).toBeTruthy();
      expect(result.max).toBeTruthy();
      expect(result.mean).toBeTruthy();
      writeResultOutput(result, "bathymetry", example.properties.name);
    }
  });
});