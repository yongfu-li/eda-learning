#!/usr/bin/env bash
set -euo pipefail
cd /mnt/d/proj/designs/eda_learning
for m in \
  module01-01-clock-sinks \
  module01-03-latency-skew \
  module02-01-h-tree \
  module02-03-mmm-tree \
  module02-05-zero-skew-merge \
  module02-07-tapping-points \
  module03-01-clock-buffering \
  module03-03-skew-bound \
  module04-01-sequential-cts
do
  echo "=== $m ==="
  python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py \
    "courses/learn_clock_tree/$m" --inject-transcript
done
echo CAPTURE_OK
