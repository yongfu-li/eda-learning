#!/usr/bin/env bash
set -euo pipefail
ROOT=$(cd "$(dirname "$0")/../../.." && pwd)
CAP="$ROOT/.cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py"
SNAP="$ROOT/.cursor/skills/module-slides/scripts/capture_lab_snapshot.py"
cd "$ROOT"
python3 "$CAP" "courses/learn_yosys/module14-01-rtlil-cpp-model" --algo rtlil-cpp-model --inject-transcript
python3 "$SNAP" --lab rtlil-cpp-model --out "courses/learn_yosys/module14-01-rtlil-cpp-model/assets"
python3 "$CAP" "courses/learn_yosys/module14-03-pass-registration" --algo pass-registration --inject-transcript
python3 "$SNAP" --lab pass-registration --out "courses/learn_yosys/module14-03-pass-registration/assets"
python3 "$CAP" "courses/learn_yosys/module15-01-read-opt-clean" --algo read-opt-clean --inject-transcript
python3 "$SNAP" --lab read-opt-clean --out "courses/learn_yosys/module15-01-read-opt-clean/assets"
python3 "$CAP" "courses/learn_yosys/module15-03-contribute-pass" --algo contribute-pass --inject-transcript
python3 "$SNAP" --lab contribute-pass --out "courses/learn_yosys/module15-03-contribute-pass/assets"
echo CAPTURE_PARTD_OK
