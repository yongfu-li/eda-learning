#!/usr/bin/env bash
set -euo pipefail
ROOT=$(cd "$(dirname "$0")/../../.." && pwd)
CAP="$ROOT/.cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py"
SNAP="$ROOT/.cursor/skills/module-slides/scripts/capture_lab_snapshot.py"
cd "$ROOT"
for pair in \
  "module09-01-paint-connectivity:paint-connectivity" \
  "module09-03-drc-region-algo:drc-region-algo" \
  "module10-01-extract-algo:extract-algo" \
  "module10-03-magic-algo-engine:magic-algo-engine"
do
  mid=${pair%%:*}
  lab=${pair##*:}
  python3 "$CAP" "courses/learn_magic/$mid" --algo "$lab" --inject-transcript
  python3 "$SNAP" --lab "$lab" --out "courses/learn_magic/$mid/assets"
done
echo CAPTURE_MAGIC_PARTC_OK
