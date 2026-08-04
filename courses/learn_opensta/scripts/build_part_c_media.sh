#!/usr/bin/env bash
set -euo pipefail
ROOT=$(cd "$(dirname "$0")/../../.." && pwd)
NAR="$ROOT/.cursor/skills/module-slides/scripts/narrate_clips.sh"
cd "$ROOT"
bash "$NAR" courses/learn_opensta/module09-01-graph-build
bash "$NAR" courses/learn_opensta/module09-03-levelize-propagate
bash "$NAR" courses/learn_opensta/module10-01-slack-algo
bash "$NAR" courses/learn_opensta/module10-03-opensta-algo-engine
bash "$NAR" courses/learn_opensta/module99-00-wrap
python3 platform/scripts/publish_course_platform.py learn_opensta
echo MEDIA_OPENSTA_PARTC_OK
