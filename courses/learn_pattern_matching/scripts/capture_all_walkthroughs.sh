#!/usr/bin/env bash
set -euo pipefail
cd /mnt/d/proj/designs/eda_learning
echo "=== module01-01-edges-polygons ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_pattern_matching/module01-01-edges-polygons" --inject-transcript
echo "=== module01-03-single-layer-edge-pair ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_pattern_matching/module01-03-single-layer-edge-pair" --inject-transcript
echo "=== module01-05-single-layer-region ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_pattern_matching/module01-05-single-layer-region" --inject-transcript
echo "=== module02-01-scanline-sweep ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_pattern_matching/module02-01-scanline-sweep" --inject-transcript
echo "=== module02-03-marker-emit ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_pattern_matching/module02-03-marker-emit" --inject-transcript
echo "=== module03-01-multi-layer-via ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_pattern_matching/module03-01-multi-layer-via" --inject-transcript
echo "=== module03-03-multi-layer-interaction ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_pattern_matching/module03-03-multi-layer-interaction" --inject-transcript
echo "=== module03-05-layered-boolean ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_pattern_matching/module03-05-layered-boolean" --inject-transcript
echo "=== module04-01-match-engine ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_pattern_matching/module04-01-match-engine" --inject-transcript
echo CAPTURE_OK
