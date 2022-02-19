#!/bin/bash
# Run in workspace

if [ ! -d src/bathy ]; then
  echo 'Missing src data'
  exit 0
fi

# Reproject and remove LZW compression
cp src/bathy/gebco_2021.tif dist/bathy.tif