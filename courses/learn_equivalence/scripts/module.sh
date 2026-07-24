#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
python3 -c "
import sys
sys.path.insert(0, '$ROOT/common')
from solvers import combo_pair_report, truth_table_cec
from equivutil import get_combo, load
d = load('$ROOT/common/tiny_equiv.json')
spec = get_combo(d, 'spec')
good = get_combo(d, 'impl_good')
bad = get_combo(d, 'impl_bad')
print('good', truth_table_cec(spec, good))
print('bad', truth_table_cec(spec, bad))
print('report', combo_pair_report(d))
"
