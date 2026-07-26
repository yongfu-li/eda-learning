#!/usr/bin/env bash
set -euo pipefail
cd /mnt/d/proj/designs/eda_learning
echo "=== module01-01-conflict-graph ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_multi_patterning/module01-01-conflict-graph" --inject-transcript
echo "=== module01-03-double-lele ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_multi_patterning/module01-03-double-lele" --inject-transcript
echo "=== module01-05-bipartite-check ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_multi_patterning/module01-05-bipartite-check" --inject-transcript
echo "=== module02-01-double-sadp ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_multi_patterning/module02-01-double-sadp" --inject-transcript
echo "=== module02-03-stitch-lite ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_multi_patterning/module02-03-stitch-lite" --inject-transcript
echo "=== module03-01-triple-color ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_multi_patterning/module03-01-triple-color" --inject-transcript
echo "=== module03-03-triple-decomp ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_multi_patterning/module03-03-triple-decomp" --inject-transcript
echo "=== module03-05-quad-color ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_multi_patterning/module03-05-quad-color" --inject-transcript
echo "=== module04-01-mp-engine ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_multi_patterning/module04-01-mp-engine" --inject-transcript
echo CAPTURE_OK
