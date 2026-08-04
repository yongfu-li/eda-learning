#!/usr/bin/env bash
set -euo pipefail
ROOT=$(cd "$(dirname "$0")/../../.." && pwd)
CAP="$ROOT/.cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py"
cd "$ROOT"
python3 "$CAP" courses/learn_netgen/module09-01-hash-devices-algo --algo hash-devices-algo --inject-transcript
python3 "$CAP" courses/learn_netgen/module09-03-match-nets-algo --algo match-nets-algo --inject-transcript
python3 "$CAP" courses/learn_netgen/module10-01-permute-pins-algo --algo permute-pins-algo --inject-transcript
python3 "$CAP" courses/learn_netgen/module10-03-netgen-algo-engine --algo netgen-algo-engine --inject-transcript
echo CAPTURE_NETGEN_PARTC_OK
