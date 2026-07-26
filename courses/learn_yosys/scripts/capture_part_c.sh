#!/usr/bin/env bash
set -euo pipefail
ROOT=$(cd "$(dirname "$0")/../../.." && pwd)
CAP="$ROOT/.cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py"
SNAP="$ROOT/.cursor/skills/module-slides/scripts/capture_lab_snapshot.py"
cd "$ROOT"
python3 "$CAP" "courses/learn_yosys/module09-01-proc-mux" --algo proc-mux --inject-transcript
python3 "$SNAP" --lab proc-mux --out "courses/learn_yosys/module09-01-proc-mux/assets"
python3 "$CAP" "courses/learn_yosys/module09-03-proc-dff-arst" --algo proc-dff-arst --inject-transcript
python3 "$SNAP" --lab proc-dff-arst --out "courses/learn_yosys/module09-03-proc-dff-arst/assets"
python3 "$CAP" "courses/learn_yosys/module10-01-opt-clean-expr" --algo opt-clean-expr --inject-transcript
python3 "$SNAP" --lab opt-clean-expr --out "courses/learn_yosys/module10-01-opt-clean-expr/assets"
python3 "$CAP" "courses/learn_yosys/module10-03-opt-merge-algo" --algo opt-merge-algo --inject-transcript
python3 "$SNAP" --lab opt-merge-algo --out "courses/learn_yosys/module10-03-opt-merge-algo/assets"
python3 "$CAP" "courses/learn_yosys/module11-01-techmap-mapfile" --algo techmap-mapfile --inject-transcript
python3 "$SNAP" --lab techmap-mapfile --out "courses/learn_yosys/module11-01-techmap-mapfile/assets"
python3 "$CAP" "courses/learn_yosys/module11-03-extract-subcircuit" --algo extract-subcircuit --inject-transcript
python3 "$SNAP" --lab extract-subcircuit --out "courses/learn_yosys/module11-03-extract-subcircuit/assets"
python3 "$CAP" "courses/learn_yosys/module12-01-memory-map-algo" --algo memory-map-algo --inject-transcript
python3 "$SNAP" --lab memory-map-algo --out "courses/learn_yosys/module12-01-memory-map-algo/assets"
python3 "$CAP" "courses/learn_yosys/module12-03-fsm-detect" --algo fsm-detect --inject-transcript
python3 "$SNAP" --lab fsm-detect --out "courses/learn_yosys/module12-03-fsm-detect/assets"
python3 "$CAP" "courses/learn_yosys/module13-01-abc-handoff" --algo abc-handoff --inject-transcript
python3 "$SNAP" --lab abc-handoff --out "courses/learn_yosys/module13-01-abc-handoff/assets"
python3 "$CAP" "courses/learn_yosys/module13-03-yosys-algo-engine" --algo yosys-algo-engine --inject-transcript
python3 "$SNAP" --lab yosys-algo-engine --out "courses/learn_yosys/module13-03-yosys-algo-engine/assets"
echo CAPTURE_PARTC_OK
