#!/usr/bin/env bash
set -euo pipefail
ROOT=$(cd "$(dirname "$0")/.." && pwd)
cd "$ROOT"
STA=${STA:-sta}
mkdir -p logs
run_one() {
  local id=$1
  local tcl=$2
  echo "=== $id ==="
  "$STA" -no_splash -exit "$tcl" > "logs/${id}.log" 2>&1
  echo "wrote logs/${id}.log"
}
run_one 01_read_link scripts/01_read_link.tcl
run_one 02_sdc scripts/02_sdc.tcl
run_one 03_report_checks scripts/03_report_checks.tcl
echo EVIDENCE_OK
