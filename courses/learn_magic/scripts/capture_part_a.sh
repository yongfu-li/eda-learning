#!/usr/bin/env bash
set -euo pipefail
ROOT=$(cd "$(dirname "$0")/../../.." && pwd)
CAP="$ROOT/.cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py"
SNAP="$ROOT/.cursor/skills/module-slides/scripts/capture_lab_snapshot.py"
cd "$ROOT"
python3 "$CAP" "courses/learn_magic/module01-01-paint-layers" --algo paint-layers --inject-transcript
python3 "$SNAP" --lab paint-layers --out "courses/learn_magic/module01-01-paint-layers/assets"
python3 "$CAP" "courses/learn_magic/module01-03-select-box" --algo select-box --inject-transcript
python3 "$SNAP" --lab select-box --out "courses/learn_magic/module01-03-select-box/assets"
python3 "$CAP" "courses/learn_magic/module02-01-contact-paint" --algo contact-paint --inject-transcript
python3 "$SNAP" --lab contact-paint --out "courses/learn_magic/module02-01-contact-paint/assets"
python3 "$CAP" "courses/learn_magic/module02-03-magic-drc-map" --algo magic-drc-map --inject-transcript
python3 "$SNAP" --lab magic-drc-map --out "courses/learn_magic/module02-03-magic-drc-map/assets"
python3 "$CAP" "courses/learn_magic/module03-01-gds-write-map" --algo gds-write-map --inject-transcript
python3 "$SNAP" --lab gds-write-map --out "courses/learn_magic/module03-01-gds-write-map/assets"
python3 "$CAP" "courses/learn_magic/module03-03-magic-engine" --algo magic-engine --inject-transcript
python3 "$SNAP" --lab magic-engine --out "courses/learn_magic/module03-03-magic-engine/assets"
echo CAPTURE_MAGIC_PARTA_OK
