#!/bin/bash

collections=( Users Teams Units Affects )
for collection in "${collections[@]}"
do
  echo "Dumping '${collection}' collection"
  mongoexport --collection=${collection} --db=karunaData --jsonArray --out=${collection}.json
done
