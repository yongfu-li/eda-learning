#!/usr/bin/env bash
set -euo pipefail
ROOT=$(cd "$(dirname "$0")/../../.." && pwd)
CAP="$ROOT/.cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py"
cd "$ROOT"
python3 "$CAP" --lab proc-elaborate --module-dir courses/learn_yosys/module01-01-proc-elaborate --inject
python3 "$CAP" --lab hierarchy-flatten --module-dir courses/learn_yosys/module01-03-hierarchy-flatten --inject
python3 "$CAP" --lab opt-dce --module-dir courses/learn_yosys/module02-01-opt-dce --inject
python3 "$CAP" --lab aig-strash --module-dir courses/learn_yosys/module02-03-aig-strash --inject
python3 "$CAP" --lab rewrite-balance --module-dir courses/learn_yosys/module03-01-rewrite-balance --inject
python3 "$CAP" --lab techmap-area --module-dir courses/learn_yosys/module03-03-techmap-area --inject
python3 "$CAP" --lab techmap-delay --module-dir courses/learn_yosys/module04-01-techmap-delay --inject
python3 "$CAP" --lab synth-script --module-dir courses/learn_yosys/module04-03-synth-script --inject
python3 "$CAP" --lab yosys-engine --module-dir courses/learn_yosys/module05-01-yosys-engine --inject
python3 "$CAP" --lab yosys-cli --module-dir courses/learn_yosys/module06-01-yosys-cli --inject
python3 "$CAP" --lab rtlil-vocab --module-dir courses/learn_yosys/module06-03-rtlil-vocab --inject
python3 "$CAP" --lab real-proc --module-dir courses/learn_yosys/module07-01-real-proc --inject
python3 "$CAP" --lab real-flatten-opt --module-dir courses/learn_yosys/module07-03-real-flatten-opt --inject
python3 "$CAP" --lab aigmap-synth --module-dir courses/learn_yosys/module08-01-aigmap-synth --inject
python3 "$CAP" --lab real-evidence --module-dir courses/learn_yosys/module08-03-real-evidence --inject
echo CAPTURE_OK
