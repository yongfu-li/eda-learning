#!/usr/bin/env bash
set -euo pipefail
ROOT=$(cd "$(dirname "$0")/../../.." && pwd)
SNAP="$ROOT/.cursor/skills/module-slides/scripts/capture_lab_snapshot.py"
cd "$ROOT"
python3 "$SNAP" --tool proc-elaborate --out courses/learn_yosys/module01-01-proc-elaborate/assets/lab-starter.png
python3 "$SNAP" --tool hierarchy-flatten --out courses/learn_yosys/module01-03-hierarchy-flatten/assets/lab-starter.png
python3 "$SNAP" --tool opt-dce --out courses/learn_yosys/module02-01-opt-dce/assets/lab-starter.png
python3 "$SNAP" --tool aig-strash --out courses/learn_yosys/module02-03-aig-strash/assets/lab-starter.png
python3 "$SNAP" --tool rewrite-balance --out courses/learn_yosys/module03-01-rewrite-balance/assets/lab-starter.png
python3 "$SNAP" --tool techmap-area --out courses/learn_yosys/module03-03-techmap-area/assets/lab-starter.png
python3 "$SNAP" --tool techmap-delay --out courses/learn_yosys/module04-01-techmap-delay/assets/lab-starter.png
python3 "$SNAP" --tool synth-script --out courses/learn_yosys/module04-03-synth-script/assets/lab-starter.png
python3 "$SNAP" --tool yosys-engine --out courses/learn_yosys/module05-01-yosys-engine/assets/lab-starter.png
python3 "$SNAP" --tool yosys-cli --out courses/learn_yosys/module06-01-yosys-cli/assets/lab-starter.png
python3 "$SNAP" --tool rtlil-vocab --out courses/learn_yosys/module06-03-rtlil-vocab/assets/lab-starter.png
python3 "$SNAP" --tool real-proc --out courses/learn_yosys/module07-01-real-proc/assets/lab-starter.png
python3 "$SNAP" --tool real-flatten-opt --out courses/learn_yosys/module07-03-real-flatten-opt/assets/lab-starter.png
python3 "$SNAP" --tool aigmap-synth --out courses/learn_yosys/module08-01-aigmap-synth/assets/lab-starter.png
python3 "$SNAP" --tool real-evidence --out courses/learn_yosys/module08-03-real-evidence/assets/lab-starter.png
echo SNAPS_OK
