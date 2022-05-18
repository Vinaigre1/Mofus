#!/bin/bash

DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
FULL_FILES_PATH="${DIR}/../data/full"
PARTIAL_FILES_PATH="${DIR}/../data/partial"

DOFUS_FILE="${FULL_FILES_PATH}/dofus.txt"
FRENCH_FILE="${FULL_FILES_PATH}/french.txt"

rm "$PARTIAL_FILES_PATH/"*".txt"

while IFS= read -r line; do
  length=${#line}
  echo "$line" >> "$PARTIAL_FILES_PATH/dofus${length}.txt"
done < "${DOFUS_FILE}"

while IFS= read -r line; do
  length=${#line}
  echo "$line" >> "$PARTIAL_FILES_PATH/french${length}.txt"
done < "${FRENCH_FILE}"
