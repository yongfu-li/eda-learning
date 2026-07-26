#!/usr/bin/env bash
set -euo pipefail
ROOT=$(cd "$(dirname "$0")/../../.." && pwd)
NAR="$ROOT/.cursor/skills/module-slides/scripts/narrate_clips.sh"
cd "$ROOT"
bash "$NAR" "courses/learn_yosys/module00-00-intro"
bash "$NAR" "courses/learn_yosys/module01-01-proc-elaborate"
bash "$NAR" "courses/learn_yosys/module01-03-hierarchy-flatten"
bash "$NAR" "courses/learn_yosys/module02-01-opt-dce"
bash "$NAR" "courses/learn_yosys/module02-03-aig-strash"
bash "$NAR" "courses/learn_yosys/module03-01-rewrite-balance"
bash "$NAR" "courses/learn_yosys/module03-03-techmap-area"
bash "$NAR" "courses/learn_yosys/module04-01-techmap-delay"
bash "$NAR" "courses/learn_yosys/module04-03-synth-script"
bash "$NAR" "courses/learn_yosys/module05-01-yosys-engine"
bash "$NAR" "courses/learn_yosys/module06-01-yosys-cli"
bash "$NAR" "courses/learn_yosys/module06-03-rtlil-vocab"
bash "$NAR" "courses/learn_yosys/module07-01-real-proc"
bash "$NAR" "courses/learn_yosys/module07-03-real-flatten-opt"
bash "$NAR" "courses/learn_yosys/module08-01-aigmap-synth"
bash "$NAR" "courses/learn_yosys/module08-03-real-evidence"
bash "$NAR" "courses/learn_yosys/module05-03-offline-benchmark-compare"
bash "$NAR" "courses/learn_yosys/module99-00-wrap"
echo MEDIA_OK
