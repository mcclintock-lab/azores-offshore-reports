#!/bin/bash
# Run in workspace

if [ ! -d src ]; then
  echo 'Missing src data'
  exit 0
fi

SRC_PATH=src
DST_PATH=dist
LAYER=cfishRichnessAll

gdalwarp -t_srs "EPSG:4326" "${SRC_PATH}/${LAYER}.tif" "${DST_PATH}/${LAYER}_4326.tif"
gdal_translate -r nearest -of COG -stats "${DST_PATH}/${LAYER}_4326.tif" "${DST_PATH}/${LAYER}_cog.tif"