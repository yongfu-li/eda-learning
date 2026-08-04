#!/usr/bin/env bash
set -euo pipefail
cd /mnt/d/proj/designs/eda_learning
echo "=== module01-01-schematic-graph ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_lvs/module01-01-schematic-graph" --inject-transcript
echo "=== module01-03-device-recog ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_lvs/module01-03-device-recog" --inject-transcript
echo "=== module01-05-net-extract ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_lvs/module01-05-net-extract" --inject-transcript
echo "=== module02-01-layout-graph ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_lvs/module02-01-layout-graph" --inject-transcript
echo "=== module02-03-pin-binding ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_lvs/module02-03-pin-binding" --inject-transcript
echo "=== module03-01-device-match ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_lvs/module03-01-device-match" --inject-transcript
echo "=== module03-03-lvs-compare ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_lvs/module03-03-lvs-compare" --inject-transcript
echo "=== module04-01-lvs-engine ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_lvs/module04-01-lvs-engine" --inject-transcript
echo CAPTURE_OK
