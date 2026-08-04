#!/usr/bin/env bash
set -euo pipefail
ROOT=$(cd "$(dirname "$0")/../../.." && pwd)
CAP="$ROOT/.cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py"
SNAP="$ROOT/.cursor/skills/module-slides/scripts/capture_lab_snapshot.py"
cd "$ROOT"
for pair in \
  "module09-01-graph-build:graph-build" \
  "module09-03-levelize-propagate:levelize-propagate" \
  "module10-01-slack-algo:slack-algo" \
  "module10-03-opensta-algo-engine:opensta-algo-engine"
do
  mid=${pair%%:*}
  lab=${pair##*:}
  python3 "$CAP" "courses/learn_opensta/$mid" --algo "$lab" --inject-transcript
  python3 "$SNAP" --lab "$lab" --out "courses/learn_opensta/$mid/assets"
done
echo CAPTURE_OPENSTA_PARTC_OK
