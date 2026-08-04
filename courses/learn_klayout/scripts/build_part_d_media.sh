#!/usr/bin/env bash
set -euo pipefail
ROOT=$(cd "$(dirname "$0")/../../.." && pwd)
NAR="$ROOT/.cursor/skills/module-slides/scripts/narrate_clips.sh"
cd "$ROOT"
for m in module14-01-layout-cell-model module14-03-read-drc-runner module15-03-contribute-klayout module99-00-wrap; do
  bash "$NAR" "courses/learn_klayout/$m"
done
python3 platform/scripts/publish_course_platform.py learn_klayout
echo MEDIA_KLAYOUT_PARTD_OK
