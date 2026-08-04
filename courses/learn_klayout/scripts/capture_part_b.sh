#!/usr/bin/env bash
set -euo pipefail
ROOT=$(cd "$(dirname "$0")/../../.." && pwd)
CAP="$ROOT/.cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py"
SNAP="$ROOT/.cursor/skills/module-slides/scripts/capture_lab_snapshot.py"
cd "$ROOT"
for pair in \
  "module06-01-klayout-cli:klayout-cli" \
  "module06-03-gds-vocab:gds-vocab" \
  "module07-01-real-stream-gds:real-stream-gds" \
  "module07-03-real-drc-script:real-drc-script" \
  "module08-01-real-markers:real-markers" \
  "module08-03-klayout-evidence:klayout-evidence"
do
  mid=${pair%%:*}
  lab=${pair##*:}
  python3 "$CAP" "courses/learn_klayout/$mid" --algo "$lab" --inject-transcript
  python3 "$SNAP" --lab "$lab" --out "courses/learn_klayout/$mid/assets"
done
echo CAPTURE_KLAYOUT_PARTB_OK
