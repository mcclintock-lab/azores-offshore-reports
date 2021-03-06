#!/bin/bash
# Run in workspace

source ./oceanuse_config.sh

SRC_PATH=src
DST_PATH=dist

for CLASS in "${CLASSES[@]}"
do
   echo "Converting "$CLASS" to COG, recalc min/max"
   gdal_translate -r nearest -of COG -stats "${SRC_PATH}/${CLASS}.tif" "${DST_PATH}/${CLASS}_cog.tif"
   echo ""
done

