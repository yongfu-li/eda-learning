#!/usr/bin/env bash
set -euo pipefail
cd /mnt/d/proj/designs/eda_learning
echo "=== module01-01-netlist-graph ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_erc/module01-01-netlist-graph" --inject-transcript
echo "=== module01-03-drivers-loads ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_erc/module01-03-drivers-loads" --inject-transcript
echo "=== module02-01-floating-nets ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_erc/module02-01-floating-nets" --inject-transcript
echo "=== module02-03-undriven-inputs ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_erc/module02-03-undriven-inputs" --inject-transcript
echo "=== module03-01-multi-driven ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_erc/module03-01-multi-driven" --inject-transcript
echo "=== module03-03-supply-shorts ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_erc/module03-03-supply-shorts" --inject-transcript
echo "=== module04-01-well-substrate ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_erc/module04-01-well-substrate" --inject-transcript
echo "=== module04-03-erc-markers ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_erc/module04-03-erc-markers" --inject-transcript
echo "=== module05-01-erc-engine ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_erc/module05-01-erc-engine" --inject-transcript
echo CAPTURE_OK
