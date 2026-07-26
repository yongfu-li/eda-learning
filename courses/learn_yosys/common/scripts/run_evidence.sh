#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p evidence logs
for s in scripts/01_read_hierarchy.ys scripts/02_proc.ys scripts/03_flatten.ys scripts/04_opt.ys scripts/04b_aigmap.ys scripts/05_synth.ys; do
  echo "===== $s ====="
  base=$(basename "$s" .ys)
  yosys -s "$s" > "logs/${base}.log" 2>&1 || {
    echo "FAILED $s"
    tail -30 "logs/${base}.log"
    exit 1
  }
  echo "--- stat excerpt ---"
  grep -E 'Number of|Chip area|modules|cells|wires|\$|TOP' "logs/${base}.log" | head -40 || true
  echo
done
echo ALL_OK
