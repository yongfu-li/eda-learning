#!/usr/bin/env bash
set -euo pipefail
ROOT=/mnt/d/proj/designs/eda_learning/courses/learn_yosys/common
sed -i 's/\r$//' "$ROOT"/scripts/*.ys "$ROOT"/scripts/*.sh "$ROOT"/scripts/*.py "$ROOT"/rtl/*.v
bash "$ROOT/scripts/run_evidence.sh"
python3 "$ROOT/scripts/build_evidence_goldens.py"
