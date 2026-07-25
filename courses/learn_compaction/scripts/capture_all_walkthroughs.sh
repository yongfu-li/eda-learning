#!/usr/bin/env bash
set -euo pipefail
cd /mnt/d/proj/designs/eda_learning
echo "=== module01-01-leaf-cells ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_compaction/module01-01-leaf-cells" --inject-transcript
echo "=== module01-03-spacing-rules ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_compaction/module01-03-spacing-rules" --inject-transcript
echo "=== module02-01-constraint-graph ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_compaction/module02-01-constraint-graph" --inject-transcript
echo "=== module02-03-longest-path ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_compaction/module02-03-longest-path" --inject-transcript
echo "=== module02-05-compact-1d ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_compaction/module02-05-compact-1d" --inject-transcript
echo "=== module02-07-compact-2d ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_compaction/module02-07-compact-2d" --inject-transcript
echo "=== module03-01-wire-jogs ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_compaction/module03-01-wire-jogs" --inject-transcript
echo "=== module03-03-shear-lite ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_compaction/module03-03-shear-lite" --inject-transcript
echo "=== module03-05-sequential-compact ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_compaction/module03-05-sequential-compact" --inject-transcript
echo CAPTURE_OK
