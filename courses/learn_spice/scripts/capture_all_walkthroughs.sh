#!/usr/bin/env bash
set -euo pipefail
cd /mnt/d/proj/designs/eda_learning
echo "=== module01-01-netlist-nodes ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_spice/module01-01-netlist-nodes" --inject-transcript
echo "=== module01-03-mna-stamps ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_spice/module01-03-mna-stamps" --inject-transcript
echo "=== module02-01-dc-linear ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_spice/module02-01-dc-linear" --inject-transcript
echo "=== module02-03-sparse-lu ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_spice/module02-03-sparse-lu" --inject-transcript
echo "=== module03-01-newton-raphson ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_spice/module03-01-newton-raphson" --inject-transcript
echo "=== module03-03-device-callbacks ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_spice/module03-03-device-callbacks" --inject-transcript
echo "=== module04-01-transient-be ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_spice/module04-01-transient-be" --inject-transcript
echo "=== module04-03-op-tran-pipeline ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_spice/module04-03-op-tran-pipeline" --inject-transcript
echo "=== module05-01-spice-engine ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_spice/module05-01-spice-engine" --inject-transcript
echo CAPTURE_OK
