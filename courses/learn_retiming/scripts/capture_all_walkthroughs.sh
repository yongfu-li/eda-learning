#!/usr/bin/env bash
set -euo pipefail
cd /mnt/d/proj/designs/eda_learning
for m in \
  module01-01-sequential-graph \
  module01-03-register-count \
  module02-01-path-delay \
  module02-03-forward-retime \
  module02-05-backward-retime \
  module02-07-legal-retime \
  module03-01-period-bound \
  module03-03-min-period \
  module03-05-area-registers
do
  echo "=== $m ==="
  python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_retiming/$m" --inject-transcript
done
echo CAPTURE_OK
