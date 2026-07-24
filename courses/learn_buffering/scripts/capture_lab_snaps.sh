#!/usr/bin/env bash
set -euo pipefail
cd /mnt/d/proj/designs/eda_learning
SKILL=.cursor/skills/module-slides/scripts
for m in courses/learn_buffering/module*/; do
  base=$(basename "$m")
  case "$base" in
    module00-*|module05-*|module99-*) continue ;;
  esac
  echo "=== lab snap $base ==="
  python3 "$SKILL/capture_lab_snapshot.py" "$m" || true
done
echo LAB_SNAPS_OK
