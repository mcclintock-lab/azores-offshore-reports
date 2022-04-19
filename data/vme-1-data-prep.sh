#!/bin/bash
# Run in workspace

source ./vme_config.sh

SRC_PATH=src/vme
DST_PATH=dist

for LAYER in "${LAYERS[@]}"
do
   gdalwarp -t_srs "EPSG:4326" "${SRC_PATH}/${LAYER}.tif" "${DST_PATH}/${LAYER}_4326.tif"
   echo "Converting "$LAYER" to COG, recalc min/max"
   gdal_translate -r nearest -of COG -stats "${DST_PATH}/${LAYER}_4326.tif" "${DST_PATH}/${LAYER}_cog.tif"
   echo ""
done