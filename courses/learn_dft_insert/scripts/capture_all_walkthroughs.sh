#!/usr/bin/env bash
set -euo pipefail
cd /mnt/d/proj/designs/eda_learning
echo "=== module01-01-scan-flops ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_dft_insert/module01-01-scan-flops" --inject-transcript
echo "=== module01-03-scan-enable ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_dft_insert/module01-03-scan-enable" --inject-transcript
echo "=== module02-01-chain-stitch ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_dft_insert/module02-01-chain-stitch" --inject-transcript
echo "=== module02-03-scan-order ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_dft_insert/module02-03-scan-order" --inject-transcript
echo "=== module03-01-lockup-latch ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_dft_insert/module03-01-lockup-latch" --inject-transcript
echo "=== module03-03-netlist-transform ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_dft_insert/module03-03-netlist-transform" --inject-transcript
echo "=== module04-01-dft-markers ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_dft_insert/module04-01-dft-markers" --inject-transcript
echo "=== module04-03-scan-chain-view ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_dft_insert/module04-03-scan-chain-view" --inject-transcript
echo "=== module05-01-dft-engine ==="
python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_dft_insert/module05-01-dft-engine" --inject-transcript
echo CAPTURE_OK
