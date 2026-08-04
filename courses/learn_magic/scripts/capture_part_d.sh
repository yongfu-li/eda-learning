#!/usr/bin/env bash
set -euo pipefail
ROOT=$(cd "$(dirname "$0")/../../.." && pwd)
CAP="$ROOT/.cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py"
SNAP="$ROOT/.cursor/skills/module-slides/scripts/capture_lab_snapshot.py"
cd "$ROOT"
for pair in \
  "module14-01-tile-plane-model:tile-plane-model" \
  "module14-03-read-drc-cifwrite:read-drc-cifwrite" \
  "module15-03-contribute-magic:contribute-magic"
do
  mid=${pair%%:*}
  lab=${pair##*:}
  python3 "$CAP" "courses/learn_magic/$mid" --algo "$lab" --inject-transcript
  python3 "$SNAP" --lab "$lab" --out "courses/learn_magic/$mid/assets"
done
echo CAPTURE_MAGIC_PARTD_OK
