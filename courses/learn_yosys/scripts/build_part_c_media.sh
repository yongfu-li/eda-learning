#!/usr/bin/env bash
set -euo pipefail
ROOT=$(cd "$(dirname "$0")/../../.." && pwd)
NAR="$ROOT/.cursor/skills/module-slides/scripts/narrate_clips.sh"
cd "$ROOT"
bash "$NAR" courses/learn_yosys/module00-00-intro
bash "$NAR" "courses/learn_yosys/module09-01-proc-mux"
bash "$NAR" "courses/learn_yosys/module09-03-proc-dff-arst"
bash "$NAR" "courses/learn_yosys/module10-01-opt-clean-expr"
bash "$NAR" "courses/learn_yosys/module10-03-opt-merge-algo"
bash "$NAR" "courses/learn_yosys/module11-01-techmap-mapfile"
bash "$NAR" "courses/learn_yosys/module11-03-extract-subcircuit"
bash "$NAR" "courses/learn_yosys/module12-01-memory-map-algo"
bash "$NAR" "courses/learn_yosys/module12-03-fsm-detect"
bash "$NAR" "courses/learn_yosys/module13-01-abc-handoff"
bash "$NAR" "courses/learn_yosys/module13-03-yosys-algo-engine"
bash "$NAR" courses/learn_yosys/module99-00-wrap
python3 platform/scripts/publish_course_platform.py learn_yosys
echo MEDIA_PARTC_OK
