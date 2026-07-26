#!/usr/bin/env bash
set -euo pipefail
ROOT=$(cd "$(dirname "$0")/../../.." && pwd)
NAR="$ROOT/.cursor/skills/module-slides/scripts/narrate_clips.sh"
cd "$ROOT"
bash "$NAR" courses/learn_opensta/module00-00-intro
bash "$NAR" courses/learn_opensta/module01-01-timing-graph-map
bash "$NAR" courses/learn_opensta/module01-03-sdc-clocks
bash "$NAR" courses/learn_opensta/module02-01-arrival-required
bash "$NAR" courses/learn_opensta/module02-03-slack-critical
bash "$NAR" courses/learn_opensta/module03-01-report-checks
bash "$NAR" courses/learn_opensta/module03-03-opensta-engine
bash "$NAR" courses/learn_opensta/module99-00-wrap
python3 platform/scripts/publish_course_platform.py learn_opensta
echo MEDIA_OPENSTA_PARTA_OK
