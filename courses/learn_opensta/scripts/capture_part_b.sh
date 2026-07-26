#!/usr/bin/env bash
set -euo pipefail
ROOT=$(cd "$(dirname "$0")/../../.." && pwd)
CAP="$ROOT/.cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py"
SNAP="$ROOT/.cursor/skills/module-slides/scripts/capture_lab_snapshot.py"
cd "$ROOT"
for pair in \
  "module06-01-opensta-cli:opensta-cli" \
  "module06-03-liberty-vocab:liberty-vocab" \
  "module07-01-real-read-netlist:real-read-netlist" \
  "module07-03-real-sdc:real-sdc" \
  "module08-01-real-report-checks:real-report-checks" \
  "module08-03-real-evidence:opensta-evidence"
do
  mid=${pair%%:*}
  lab=${pair##*:}
  python3 "$CAP" "courses/learn_opensta/$mid" --algo "$lab" --inject-transcript
  python3 "$SNAP" --lab "$lab" --out "courses/learn_opensta/$mid/assets"
done
echo CAPTURE_OPENSTA_PARTB_OK
