#!/usr/bin/env bash
set -euo pipefail
ROOT=$(cd "$(dirname "$0")/../../.." && pwd)
CAP="$ROOT/.cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py"
SNAP="$ROOT/.cursor/skills/module-slides/scripts/capture_lab_snapshot.py"
cd "$ROOT"
python3 "$CAP" "courses/learn_opensta/module14-01-sta-cpp-model" --algo sta-cpp-model --inject-transcript
python3 "$SNAP" --lab sta-cpp-model --out "courses/learn_opensta/module14-01-sta-cpp-model/assets"
python3 "$CAP" "courses/learn_opensta/module14-03-read-find-path" --algo read-find-path --inject-transcript
python3 "$SNAP" --lab read-find-path --out "courses/learn_opensta/module14-03-read-find-path/assets"
python3 "$CAP" "courses/learn_opensta/module15-03-contribute-opensta" --algo contribute-opensta --inject-transcript
python3 "$SNAP" --lab contribute-opensta --out "courses/learn_opensta/module15-03-contribute-opensta/assets"
echo CAPTURE_OPENSTA_PARTD_OK
