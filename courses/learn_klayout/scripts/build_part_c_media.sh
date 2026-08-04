#!/usr/bin/env bash
set -euo pipefail
ROOT=$(cd "$(dirname "$0")/../../.." && pwd)
NAR="$ROOT/.cursor/skills/module-slides/scripts/narrate_clips.sh"
cd "$ROOT"
for m in module09-01-layer-query-algo module09-03-width-spacing-algo module10-01-marker-emit-algo module10-03-klayout-algo-engine; do
  bash "$NAR" "courses/learn_klayout/$m"
done
python3 platform/scripts/publish_course_platform.py learn_klayout
echo MEDIA_KLAYOUT_PARTC_OK
