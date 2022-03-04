#!/bin/bash
# Run in workspace

if [ ! -d src/bathy ]; then
  echo 'Missing src data'
  exit 0
fi

# No prep needed, use as is
cp src/bathy/gebco_2021.tif dist/bathy.tif