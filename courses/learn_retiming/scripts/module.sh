#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
python3 -c "
import sys
sys.path.insert(0, '$ROOT/common')
from solvers import min_period_binary_search
from retimeutil import load
m = min_period_binary_search(load('$ROOT/common/tiny_retime.json'))
print('period', m['period'], 'registers', m['registers'])
"
