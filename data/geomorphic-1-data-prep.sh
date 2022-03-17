#!/bin/bash
# Run in workspace

SRC_PATH=src
DST_PATH=dist
LAYER=geomorphic_units
gdal_translate -r nearest -of COG -stats "${SRC_PATH}/${LAYER}.tif" "${DST_PATH}/${LAYER}_cog.tif"