#!/usr/bin/env bash
set -euo pipefail
cd /mnt/d/proj/designs/eda_learning
for m in \
  module01-01-boolean-network \
  module01-03-aig-nodes \
  module02-01-aig-strash \
  module02-03-rewrite-local \
  module02-05-cut-enumeration \
  module02-07-library-cells \
  module03-01-techmap-cover \
  module03-03-area-delay \
  module04-01-sequential-synth
do
  echo "=== $m ==="
  python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_synthesis/$m" --inject-transcript
done
echo CAPTURE_OK
