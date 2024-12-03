#!/bin/bash

# Array of directories to process
DIRECTORIES=("__tests__") # Add the directories you want to process here
# DIRECTORIES=("src/types", "src/pages" "src/components" "src/utils", "src/client-functions", "src/zustand", "src/server") # Add the directories you want to process here

# Text to prepend to the files
TEXT_TO_PREPEND="/* eslint-disable @typescript-eslint/ban-ts-comment */\n// @ts-nocheck\n\n"

# Function to prepend text to a file
prepend_text_to_file() {
  local file=$1
  if ! grep -q "@ts-nocheck" "$file"; then # Check if the file already has @ts-nocheck
    echo -e "$TEXT_TO_PREPEND$(cat "$file")" >"$file"
    echo "Updated $file"
  else
    echo "$file already has @ts-nocheck"
  fi
}

# Crawl directories and find all .ts and .tsx files
for dir in "${DIRECTORIES[@]}"; do
  find "$dir" -type f \( -name "*.ts" -o -name "*.tsx" \) | while read -r file; do
    prepend_text_to_file "$file"
  done
done

echo "Completed processing directories."
