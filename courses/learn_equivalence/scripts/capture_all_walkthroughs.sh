#!/usr/bin/env bash
set -euo pipefail
cd /mnt/d/proj/designs/eda_learning
for m in \
  module01-01-spec-impl \
  module01-03-miter-build \
  module02-01-truth-table-cec \
  module02-03-structural-hash \
  module02-05-sat-cnf-lite \
  module02-07-counterexample \
  module03-01-dont-care \
  module03-03-sequential-unroll \
  module03-05-sequential-cec
do
  echo "=== $m ==="
  python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_equivalence/$m" --inject-transcript
done
echo CAPTURE_OK
