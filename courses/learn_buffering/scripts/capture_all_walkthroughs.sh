#!/usr/bin/env bash
set -euo pipefail
cd /mnt/d/proj/designs/eda_learning
for m in \
  module01-01-wire-rc \
  module01-03-slew-budget \
  module02-01-candidate-sites \
  module02-03-buffer-library \
  module02-05-van-ginneken \
  module02-07-slew-driven \
  module03-01-polarity-invert \
  module03-03-fanout-tree \
  module04-01-sequential-buffer
do
  echo "=== $m ==="
  python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py \
    "courses/learn_buffering/$m" --inject-transcript
done
echo CAPTURE_OK
