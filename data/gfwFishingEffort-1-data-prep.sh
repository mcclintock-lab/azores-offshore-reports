#!/bin/bash
# Run in workspace

source ./gfwFishingEffort_config.sh

SRC_PATH=src/gfw
DST_PATH=dist

for CLASS in "${CLASSES[@]}"
do
   echo "Converting "$CLASS" to COG, recalc min/max"
   gdal_translate -r nearest -of COG -stats "${SRC_PATH}/${CLASS}.tif" "${DST_PATH}/${CLASS}_cog.tif"
   echo ""
done

