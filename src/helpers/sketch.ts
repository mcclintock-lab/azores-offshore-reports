import {
  NullSketch,
  NullSketchCollection,
  isSketchCollection,
  isNullSketchCollection,
  Sketch,
  SketchCollection,
  isNullSketch,
  isSketch,
} from "@seasketch/geoprocessing/client-core";

/**
 * Given single or collection of sketches, returns array of sketch features, ignoring sketch collections.  Assumes collection objects can root or leaf
 * @param sketch
 */
export function getSketchFeatures(
  sketch: Sketch | SketchCollection | NullSketchCollection | NullSketch
) {
  if (isSketch(sketch) || isNullSketch(sketch)) {
    return [sketch];
  } else if (isSketchCollection(sketch)) {
    return sketch.features.filter((feat) => !feat.properties.isCollection);
  } else if (isNullSketchCollection(sketch)) {
    return sketch.features.filter((feat) => !feat.properties.isCollection);
  } else {
    throw new Error("Not a valid sketch");
  }
}
