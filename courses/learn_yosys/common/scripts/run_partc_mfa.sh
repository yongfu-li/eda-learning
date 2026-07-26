#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p logs/partc
for s in partc_05_memory partc_06_fsm partc_07_abc; do
  echo "===== $s ====="
  if yosys -s "scripts/${s}.ys" > "logs/partc/${s}.log" 2>&1; then
    echo EXIT:0
  else
    echo EXIT:$?
  fi
  grep -E 'Number of (cells|processes|wires)|^\s+\$|Extracted FSM|memory|FSM|\$mem' "logs/partc/${s}.log" | head -60 || true
  echo
done
