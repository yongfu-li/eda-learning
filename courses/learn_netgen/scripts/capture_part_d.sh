#!/usr/bin/env bash
set -euo pipefail
ROOT=$(cd "$(dirname "$0")/../../.." && pwd)
CAP="$ROOT/.cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py"
cd "$ROOT"
python3 "$CAP" courses/learn_netgen/module14-01-netcomp-model --algo netcomp-model --inject-transcript
python3 "$CAP" courses/learn_netgen/module14-03-read-compare-c --algo read-compare-c --inject-transcript
python3 "$CAP" courses/learn_netgen/module15-03-contribute-netgen --algo contribute-netgen --inject-transcript
echo CAPTURE_NETGEN_PARTD_OK
