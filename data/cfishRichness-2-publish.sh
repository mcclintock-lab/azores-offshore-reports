#!/bin/bash
source ../.env

aws s3 cp --recursive dist/ s3://gp-azores-offshore-reports-2-datasets --cache-control max-age=3600 --exclude "*" --include "cfishRichnessAll_cog.*"