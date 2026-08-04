#!/usr/bin/env bash
set -euo pipefail
ROOT=$(cd "$(dirname "$0")/../../.." && pwd)
NAR="$ROOT/.cursor/skills/module-slides/scripts/narrate_clips.sh"
cd "$ROOT"
bash "$NAR" courses/learn_klayout/module00-00-intro
bash "$NAR" courses/learn_klayout/module01-01-layers-view-map
bash "$NAR" courses/learn_klayout/module01-03-cell-hierarchy-map
bash "$NAR" courses/learn_klayout/module02-01-stream-gds-map
bash "$NAR" courses/learn_klayout/module02-03-drc-script-map
bash "$NAR" courses/learn_klayout/module03-01-markers-report-map
bash "$NAR" courses/learn_klayout/module03-03-klayout-engine
bash "$NAR" courses/learn_klayout/module99-00-wrap
python3 platform/scripts/publish_course_platform.py learn_klayout
echo MEDIA_KLAYOUT_PARTA_OK
