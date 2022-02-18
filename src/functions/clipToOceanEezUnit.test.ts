/**
 * @group unit
 */

import { clipLand, clipOutsideEez, clipToOceanEez } from "./clipToOceanEez";
import {
  getExampleFeatures,
  getExampleFeaturesByName,
  writeResultOutput,
} from "@seasketch/geoprocessing/scripts/testing";
import {
  ValidationError,
  Feature,
  Polygon,
  MultiPolygon,
  fixtures,
} from "@seasketch/geoprocessing";
import booleanValid from "@turf/boolean-valid";

describe("Basic unit tests", () => {
  test("clipToOceanEez - should throw ValidationError if self-crossing", async () => {
    expect(
      async () =>
        await clipToOceanEez(fixtures.invalid.selfCrossingSketchPolygon)
    ).rejects.toThrow(ValidationError);
  });
});
