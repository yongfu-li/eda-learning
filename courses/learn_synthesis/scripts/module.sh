#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
python3 -c "import sys; sys.path.insert(0,'$ROOT/common'); from solvers import sequential_synth; from synthutil import load; print(sequential_synth(load('$ROOT/common/tiny_synth.json'))['mapping']['area'])"
