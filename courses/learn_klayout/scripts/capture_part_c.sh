#!/usr/bin/env bash
set -euo pipefail
ROOT=$(cd "$(dirname "$0")/../../.." && pwd)
CAP="$ROOT/.cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py"
SNAP="$ROOT/.cursor/skills/module-slides/scripts/capture_lab_snapshot.py"
cd "$ROOT"
for pair in \
  "module09-01-layer-query-algo:layer-query-algo" \
  "module09-03-width-spacing-algo:width-spacing-algo" \
  "module10-01-marker-emit-algo:marker-emit-algo" \
  "module10-03-klayout-algo-engine:klayout-algo-engine"
do
  mid=${pair%%:*}
  lab=${pair##*:}
  python3 "$CAP" "courses/learn_klayout/$mid" --algo "$lab" --inject-transcript
  python3 "$SNAP" --lab "$lab" --out "courses/learn_klayout/$mid/assets"
done
echo CAPTURE_KLAYOUT_PARTC_OK
