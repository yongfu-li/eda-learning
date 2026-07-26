# Examples — opt_merge algorithm

## Track A

```bash
cd courses/learn_yosys/common
python3 -c "from algo_solvers import *; print(algo_opt_merge())"
```

IR: `tiny_algo.json` · solvers: `algo_solvers.py` · goldens: `GOLDENS` in algo_solvers.

## Pseudocode

```text
after opt_clean
key ← (type,A,B) for and/or
if key seen: remap Y and drop duplicate
ok if and_count == 1
```

## Notes

GOLDEN: after merge and_count=1 (one duplicate AND removed).
