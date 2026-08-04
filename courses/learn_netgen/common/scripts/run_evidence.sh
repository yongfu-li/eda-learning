#!/usr/bin/env bash
# Optional: regenerate Netgen evidence when netgen binary is installed.
set -euo pipefail
ROOT=$(cd "$(dirname "$0")/.." && pwd)
cd "$ROOT"
if ! command -v netgen >/dev/null 2>&1; then
  echo "netgen not installed — using checked-in logs/goldens.json"
  python3 real_solvers.py
  exit 0
fi
netgen -batch -noc -nolog scripts/01_read_spice.tcl > logs/01_read_spice.log
netgen -batch -noc -nolog scripts/02_lvs_compare.tcl > logs/02_lvs_compare.log
netgen -batch -noc -nolog scripts/03_lvs_report.tcl > logs/03_lvs_report.log
python3 real_solvers.py
