#!/usr/bin/env bash
set -euo pipefail
cd /mnt/d/proj/designs/eda_learning
echo "=== module01-01-geometry-load ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_pex/module01-01-geometry-load" --inject-transcript
echo "=== module01-03-resistance-extract ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_pex/module01-03-resistance-extract" --inject-transcript
echo "=== module01-05-capacitance-extract ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_pex/module01-05-capacitance-extract" --inject-transcript
echo "=== module02-01-rc-network ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_pex/module02-01-rc-network" --inject-transcript
echo "=== module02-03-network-reduce ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_pex/module02-03-network-reduce" --inject-transcript
echo "=== module03-01-back-annotate ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_pex/module03-01-back-annotate" --inject-transcript
echo "=== module03-03-spef-lite ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_pex/module03-03-spef-lite" --inject-transcript
echo "=== module04-01-pex-engine ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_pex/module04-01-pex-engine" --inject-transcript
echo CAPTURE_OK
