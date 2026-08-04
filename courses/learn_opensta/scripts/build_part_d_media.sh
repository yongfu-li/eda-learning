#!/usr/bin/env bash
set -euo pipefail
ROOT=$(cd "$(dirname "$0")/../../.." && pwd)
NAR="$ROOT/.cursor/skills/module-slides/scripts/narrate_clips.sh"
cd "$ROOT"
bash "$NAR" courses/learn_opensta/module14-01-sta-cpp-model
bash "$NAR" courses/learn_opensta/module14-03-read-find-path
bash "$NAR" courses/learn_opensta/module15-03-contribute-opensta
bash "$NAR" courses/learn_opensta/module99-00-wrap
python3 platform/scripts/publish_course_platform.py learn_opensta
echo MEDIA_OPENSTA_PARTD_OK
