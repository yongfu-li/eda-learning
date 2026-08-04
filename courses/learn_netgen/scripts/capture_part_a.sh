#!/usr/bin/env bash
set -euo pipefail
ROOT=$(cd "$(dirname "$0")/../../.." && pwd)
CAP="$ROOT/.cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py"
SNAP="$ROOT/.cursor/skills/module-slides/scripts/capture_lab_snapshot.py"
cd "$ROOT"
python3 "$CAP" "courses/learn_netgen/module01-01-read-netlists-map" --algo read-netlists-map --inject-transcript
python3 "$SNAP" --lab read-netlists-map --out "courses/learn_netgen/module01-01-read-netlists-map/assets"
python3 "$CAP" "courses/learn_netgen/module01-03-device-classes-map" --algo device-classes-map --inject-transcript
python3 "$SNAP" --lab device-classes-map --out "courses/learn_netgen/module01-03-device-classes-map/assets"
python3 "$CAP" "courses/learn_netgen/module02-01-flatten-permute-map" --algo flatten-permute-map --inject-transcript
python3 "$SNAP" --lab flatten-permute-map --out "courses/learn_netgen/module02-01-flatten-permute-map/assets"
python3 "$CAP" "courses/learn_netgen/module02-03-compare-nets-map" --algo compare-nets-map --inject-transcript
python3 "$SNAP" --lab compare-nets-map --out "courses/learn_netgen/module02-03-compare-nets-map/assets"
python3 "$CAP" "courses/learn_netgen/module03-01-lvs-report-map" --algo lvs-report-map --inject-transcript
python3 "$SNAP" --lab lvs-report-map --out "courses/learn_netgen/module03-01-lvs-report-map/assets"
python3 "$CAP" "courses/learn_netgen/module03-03-netgen-engine" --algo netgen-engine --inject-transcript
python3 "$SNAP" --lab netgen-engine --out "courses/learn_netgen/module03-03-netgen-engine/assets"
echo CAPTURE_NETGEN_PARTA_OK
