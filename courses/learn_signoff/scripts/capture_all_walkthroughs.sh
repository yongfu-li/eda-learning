#!/usr/bin/env bash
set -euo pipefail
cd /mnt/d/proj/designs/eda_learning
echo "=== module01-01-corners ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_signoff/module01-01-corners" --inject-transcript
echo "=== module01-03-signoff-corner ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_signoff/module01-03-signoff-corner" --inject-transcript
echo "=== module02-01-derate ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_signoff/module02-01-derate" --inject-transcript
echo "=== module02-03-check-suite ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_signoff/module02-03-check-suite" --inject-transcript
echo "=== module03-01-eco-loop ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_signoff/module03-01-eco-loop" --inject-transcript
echo "=== module03-03-apply-ecos ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_signoff/module03-03-apply-ecos" --inject-transcript
echo "=== module04-01-tapeout-checklist ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_signoff/module04-01-tapeout-checklist" --inject-transcript
echo "=== module04-03-signoff-markers ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_signoff/module04-03-signoff-markers" --inject-transcript
echo "=== module05-01-signoff-engine ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_signoff/module05-01-signoff-engine" --inject-transcript
echo CAPTURE_OK
