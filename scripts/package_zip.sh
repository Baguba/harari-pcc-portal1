#!/bin/bash
# Package the MCIT portal project as a ZIP file under /home/z/my-project/download/
# Excludes node_modules, .next build cache, db files, dev logs, and OS cruft.
set -e

PROJECT_DIR="/home/z/my-project"
OUT_DIR="${PROJECT_DIR}/download"
OUT_ZIP="${OUT_DIR}/mcit-portal.zip"

mkdir -p "${OUT_DIR}"

# Remove old zip if exists
rm -f "${OUT_ZIP}"

# Build the zip from inside the project directory so paths are relative
cd "${PROJECT_DIR}"

zip -r "${OUT_ZIP}" . \
  -x "node_modules/*" \
  -x ".next/*" \
  -x ".git/*" \
  -x "db/*" \
  -x "*.log" \
  -x "dev.log" \
  -x ".zscripts/*" \
  -x ".DS_Store" \
  -x "*/.DS_Store" \
  -x "upload/*" \
  -x "tool-results/*" \
  -x "download/*" \
  -x "*.tar" \
  -x "skills/*" \
  -x "examples/*" \
  -x ".eslintcache" \
  -x "*.tsbuildinfo" \
  -x "bun.lock" \
  -x "bun.lockb" \
  -x "package-lock.json" \
  > /tmp/zip.log 2>&1

echo "✓ Created ${OUT_ZIP}"
ls -lh "${OUT_ZIP}"
echo
echo "Contents (top-level):"
unzip -l "${OUT_ZIP}" | head -30
echo "..."
echo
echo "Total file count:"
unzip -l "${OUT_ZIP}" | tail -1
