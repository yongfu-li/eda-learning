#!/usr/bin/env bash
set -euo pipefail
cd /mnt/d/proj/designs/eda_learning
echo "=== module01-01-rule-deck ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_drc/module01-01-rule-deck" --inject-transcript
echo "=== module01-03-width-checker ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_drc/module01-03-width-checker" --inject-transcript
echo "=== module01-05-spacing-checker ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_drc/module01-05-spacing-checker" --inject-transcript
echo "=== module02-01-enclosure-checker ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_drc/module02-01-enclosure-checker" --inject-transcript
echo "=== module02-03-violation-markers ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_drc/module02-03-violation-markers" --inject-transcript
echo "=== module03-01-multi-layer-deck ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_drc/module03-01-multi-layer-deck" --inject-transcript
echo "=== module03-03-deck-boolean ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_drc/module03-03-deck-boolean" --inject-transcript
echo "=== module04-01-drc-engine ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_drc/module04-01-drc-engine" --inject-transcript
echo CAPTURE_OK
