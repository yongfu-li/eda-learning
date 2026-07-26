#!/usr/bin/env bash
set -euo pipefail
ROOT=$(cd "$(dirname "$0")/../../.." && pwd)
NAR="$ROOT/.cursor/skills/module-slides/scripts/narrate_clips.sh"
cd "$ROOT"
bash "$NAR" courses/learn_opensta/module06-01-opensta-cli
bash "$NAR" courses/learn_opensta/module06-03-liberty-vocab
bash "$NAR" courses/learn_opensta/module07-01-real-read-netlist
bash "$NAR" courses/learn_opensta/module07-03-real-sdc
bash "$NAR" courses/learn_opensta/module08-01-real-report-checks
bash "$NAR" courses/learn_opensta/module08-03-real-evidence
bash "$NAR" courses/learn_opensta/module99-00-wrap
# lab id opensta-evidence (not Yosys real-evidence)
python3 platform/scripts/publish_course_platform.py learn_opensta
echo MEDIA_OPENSTA_PARTB_OK
