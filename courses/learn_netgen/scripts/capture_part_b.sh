#!/usr/bin/env bash
set -euo pipefail
ROOT=$(cd "$(dirname "$0")/../../.." && pwd)
CAP="$ROOT/.cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py"
cd "$ROOT"
python3 "$CAP" courses/learn_netgen/module06-01-netgen-cli --algo netgen-cli --inject-transcript
python3 "$CAP" courses/learn_netgen/module06-03-spice-vocab --algo spice-vocab --inject-transcript
python3 "$CAP" courses/learn_netgen/module07-01-real-read-spice --algo real-read-spice --inject-transcript
python3 "$CAP" courses/learn_netgen/module07-03-real-lvs-compare --algo real-lvs-compare --inject-transcript
python3 "$CAP" courses/learn_netgen/module08-01-real-lvs-report --algo real-lvs-report --inject-transcript
python3 "$CAP" courses/learn_netgen/module08-03-netgen-evidence --algo netgen-evidence --inject-transcript
echo CAPTURE_NETGEN_PARTB_OK
