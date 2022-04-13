#!/bin/bash
# Run in workspace

SRC_DATASET=src/ST_fishbased_solution.fgb
DIST_DATASET=dist/ST_fishbased_solution

if [ ! -f "$SRC_DATASET" ]; then
  echo 'Missing src dataset'
  exit 0
fi

rm -rf $DIST_DATASET

# Convert to polygon
ogr2ogr -t_srs "EPSG:4326" -f FlatGeobuf -explodecollections "${DIST_DATASET}.fgb" "${SRC_DATASET}"
ogr2ogr -t_srs "EPSG:4326" -f GeoJSON -explodecollections "${DIST_DATASET}.json" "${SRC_DATASET}"