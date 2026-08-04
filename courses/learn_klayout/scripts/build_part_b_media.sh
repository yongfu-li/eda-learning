#!/usr/bin/env bash
set -euo pipefail
ROOT=$(cd "$(dirname "$0")/../../.." && pwd)
NAR="$ROOT/.cursor/skills/module-slides/scripts/narrate_clips.sh"
cd "$ROOT"
for m in module06-01-klayout-cli module06-03-gds-vocab module07-01-real-stream-gds module07-03-real-drc-script module08-01-real-markers module08-03-klayout-evidence; do
  bash "$NAR" "courses/learn_klayout/$m"
done
python3 platform/scripts/publish_course_platform.py learn_klayout
echo MEDIA_KLAYOUT_PARTB_OK
