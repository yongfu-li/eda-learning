#!/usr/bin/env bash
set -euo pipefail
cd /mnt/d/proj/designs/eda_learning
echo "=== module01-01-switching-power ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_power/module01-01-switching-power" --inject-transcript
echo "=== module01-03-leakage-power ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_power/module01-03-leakage-power" --inject-transcript
echo "=== module02-01-total-power ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_power/module02-01-total-power" --inject-transcript
echo "=== module02-03-activity-factors ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_power/module02-03-activity-factors" --inject-transcript
echo "=== module03-01-power-grid ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_power/module03-01-power-grid" --inject-transcript
echo "=== module03-03-ir-drop ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_power/module03-03-ir-drop" --inject-transcript
echo "=== module04-01-em-literacy ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_power/module04-01-em-literacy" --inject-transcript
echo "=== module04-03-power-markers ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_power/module04-03-power-markers" --inject-transcript
echo "=== module05-01-power-engine ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_power/module05-01-power-engine" --inject-transcript
echo CAPTURE_OK
