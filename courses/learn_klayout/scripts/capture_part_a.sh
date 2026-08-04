#!/usr/bin/env bash
set -euo pipefail
ROOT=$(cd "$(dirname "$0")/../../.." && pwd)
CAP="$ROOT/.cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py"
SNAP="$ROOT/.cursor/skills/module-slides/scripts/capture_lab_snapshot.py"
cd "$ROOT"
python3 "$CAP" "courses/learn_klayout/module01-01-layers-view-map" --algo layers-view-map --inject-transcript
python3 "$SNAP" --lab layers-view-map --out "courses/learn_klayout/module01-01-layers-view-map/assets"
python3 "$CAP" "courses/learn_klayout/module01-03-cell-hierarchy-map" --algo cell-hierarchy-map --inject-transcript
python3 "$SNAP" --lab cell-hierarchy-map --out "courses/learn_klayout/module01-03-cell-hierarchy-map/assets"
python3 "$CAP" "courses/learn_klayout/module02-01-stream-gds-map" --algo stream-gds-map --inject-transcript
python3 "$SNAP" --lab stream-gds-map --out "courses/learn_klayout/module02-01-stream-gds-map/assets"
python3 "$CAP" "courses/learn_klayout/module02-03-drc-script-map" --algo drc-script-map --inject-transcript
python3 "$SNAP" --lab drc-script-map --out "courses/learn_klayout/module02-03-drc-script-map/assets"
python3 "$CAP" "courses/learn_klayout/module03-01-markers-report-map" --algo markers-report-map --inject-transcript
python3 "$SNAP" --lab markers-report-map --out "courses/learn_klayout/module03-01-markers-report-map/assets"
python3 "$CAP" "courses/learn_klayout/module03-03-klayout-engine" --algo klayout-engine --inject-transcript
python3 "$SNAP" --lab klayout-engine --out "courses/learn_klayout/module03-03-klayout-engine/assets"
echo CAPTURE_KLAYOUT_PARTA_OK
