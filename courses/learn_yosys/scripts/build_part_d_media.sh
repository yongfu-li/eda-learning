#!/usr/bin/env bash
set -euo pipefail
ROOT=$(cd "$(dirname "$0")/../../.." && pwd)
NAR="$ROOT/.cursor/skills/module-slides/scripts/narrate_clips.sh"
cd "$ROOT"
bash "$NAR" courses/learn_yosys/module00-00-intro
bash "$NAR" "courses/learn_yosys/module14-01-rtlil-cpp-model"
bash "$NAR" "courses/learn_yosys/module14-03-pass-registration"
bash "$NAR" "courses/learn_yosys/module15-01-read-opt-clean"
bash "$NAR" "courses/learn_yosys/module15-03-contribute-pass"
bash "$NAR" courses/learn_yosys/module99-00-wrap
python3 platform/scripts/publish_course_platform.py learn_yosys
echo MEDIA_PARTD_OK
