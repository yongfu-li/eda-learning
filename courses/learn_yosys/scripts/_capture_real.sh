#!/usr/bin/env bash
set -euo pipefail
ROOT=/mnt/d/proj/designs/eda_learning
cd "$ROOT"
sed -i 's/\r$//' courses/learn_yosys/scripts/*.sh
CAP="$ROOT/.cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py"
SNAP="$ROOT/.cursor/skills/module-slides/scripts/capture_lab_snapshot.py"

pairs=(
  "yosys-cli:module06-01-yosys-cli"
  "rtlil-vocab:module06-03-rtlil-vocab"
  "real-proc:module07-01-real-proc"
  "real-flatten-opt:module07-03-real-flatten-opt"
  "aigmap-synth:module08-01-aigmap-synth"
  "real-evidence:module08-03-real-evidence"
)

for pair in "${pairs[@]}"; do
  lab="${pair%%:*}"
  mid="${pair##*:}"
  echo "=== capture $lab ==="
  python3 "$CAP" "courses/learn_yosys/$mid" --algo "$lab" --inject-transcript
  python3 "$SNAP" --lab "$lab" --out "courses/learn_yosys/$mid/assets"
done
echo CAPTURE_REAL_OK
