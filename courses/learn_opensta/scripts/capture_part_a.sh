#!/usr/bin/env bash
set -euo pipefail
ROOT=$(cd "$(dirname "$0")/../../.." && pwd)
CAP="$ROOT/.cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py"
SNAP="$ROOT/.cursor/skills/module-slides/scripts/capture_lab_snapshot.py"
cd "$ROOT"
python3 "$CAP" "courses/learn_opensta/module01-01-timing-graph-map" --algo timing-graph-map --inject-transcript
python3 "$SNAP" --lab timing-graph-map --out "courses/learn_opensta/module01-01-timing-graph-map/assets"
python3 "$CAP" "courses/learn_opensta/module01-03-sdc-clocks" --algo sdc-clocks --inject-transcript
python3 "$SNAP" --lab sdc-clocks --out "courses/learn_opensta/module01-03-sdc-clocks/assets"
python3 "$CAP" "courses/learn_opensta/module02-01-arrival-required" --algo arrival-required --inject-transcript
python3 "$SNAP" --lab arrival-required --out "courses/learn_opensta/module02-01-arrival-required/assets"
python3 "$CAP" "courses/learn_opensta/module02-03-slack-critical" --algo slack-critical --inject-transcript
python3 "$SNAP" --lab slack-critical --out "courses/learn_opensta/module02-03-slack-critical/assets"
python3 "$CAP" "courses/learn_opensta/module03-01-report-checks" --algo report-checks --inject-transcript
python3 "$SNAP" --lab report-checks --out "courses/learn_opensta/module03-01-report-checks/assets"
python3 "$CAP" "courses/learn_opensta/module03-03-opensta-engine" --algo opensta-engine --inject-transcript
python3 "$SNAP" --lab opensta-engine --out "courses/learn_opensta/module03-03-opensta-engine/assets"
echo CAPTURE_OPENSTA_PARTA_OK
