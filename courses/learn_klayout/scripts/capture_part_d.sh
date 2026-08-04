#!/usr/bin/env bash
set -euo pipefail
ROOT=$(cd "$(dirname "$0")/../../.." && pwd)
CAP="$ROOT/.cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py"
SNAP="$ROOT/.cursor/skills/module-slides/scripts/capture_lab_snapshot.py"
cd "$ROOT"
for pair in \
  "module14-01-layout-cell-model:layout-cell-model" \
  "module14-03-read-drc-runner:read-drc-runner" \
  "module15-03-contribute-klayout:contribute-klayout"
do
  mid=${pair%%:*}
  lab=${pair##*:}
  python3 "$CAP" "courses/learn_klayout/$mid" --algo "$lab" --inject-transcript
  python3 "$SNAP" --lab "$lab" --out "courses/learn_klayout/$mid/assets"
done
echo CAPTURE_KLAYOUT_PARTD_OK
