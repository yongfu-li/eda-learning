#!/usr/bin/env bash
set -euo pipefail
ROOT=$(cd "$(dirname "$0")/../../.." && pwd)
CAP="$ROOT/.cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py"
SNAP="$ROOT/.cursor/skills/module-slides/scripts/capture_lab_snapshot.py"
cd "$ROOT"
for pair in \
  "module06-01-magic-cli:magic-cli" \
  "module06-03-magic-tech-vocab:magic-tech-vocab" \
  "module07-01-real-paint-save:real-paint-save" \
  "module07-03-real-drc:real-drc" \
  "module08-01-real-gds:real-gds" \
  "module08-03-magic-evidence:magic-evidence"
do
  mid=${pair%%:*}
  lab=${pair##*:}
  python3 "$CAP" "courses/learn_magic/$mid" --algo "$lab" --inject-transcript
  python3 "$SNAP" --lab "$lab" --out "courses/learn_magic/$mid/assets"
done
echo CAPTURE_MAGIC_PARTB_OK
