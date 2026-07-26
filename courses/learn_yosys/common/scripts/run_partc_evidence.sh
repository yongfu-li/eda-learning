#!/usr/bin/env bash
# Run Part C real-Yosys evidence scripts; write logs under logs/partc/
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p logs/partc evidence/partc
for s in \
  scripts/partc_00_read.ys \
  scripts/partc_01_proc_mux.ys \
  scripts/partc_02_proc.ys \
  scripts/partc_03_opt.ys \
  scripts/partc_04_techmap.ys \
  scripts/partc_05_memory.ys \
  scripts/partc_06_fsm.ys \
  scripts/partc_07_abc.ys \
  scripts/partc_08_extract.ys
do
  base=$(basename "$s" .ys)
  echo "===== $s ====="
  yosys -s "$s" > "logs/partc/${base}.log" 2>&1
  echo "--- cells ---"
  grep -E 'Number of (cells|processes)|^\s+\$|Found FSM|Extracting FSM|parameter \\(WIDTH|SIZE|STATE_NUM)' \
    "logs/partc/${base}.log" | head -40 || true
  echo
done
echo PARTC_EVIDENCE_OK
