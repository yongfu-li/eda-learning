#!/usr/bin/env bash
set -euo pipefail
cd /mnt/d/proj/designs/eda_learning
echo "=== module01-01-metal-area ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_antenna/module01-01-metal-area" --inject-transcript
echo "=== module01-03-gate-area ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_antenna/module01-03-gate-area" --inject-transcript
echo "=== module02-01-antenna-ratio ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_antenna/module02-01-antenna-ratio" --inject-transcript
echo "=== module02-03-charge-accumulation ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_antenna/module02-03-charge-accumulation" --inject-transcript
echo "=== module03-01-threshold-rules ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_antenna/module03-01-threshold-rules" --inject-transcript
echo "=== module03-03-diode-protection ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_antenna/module03-03-diode-protection" --inject-transcript
echo "=== module04-01-jumper-break ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_antenna/module04-01-jumper-break" --inject-transcript
echo "=== module04-03-antenna-markers ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_antenna/module04-03-antenna-markers" --inject-transcript
echo "=== module05-01-antenna-engine ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_antenna/module05-01-antenna-engine" --inject-transcript
echo CAPTURE_OK
