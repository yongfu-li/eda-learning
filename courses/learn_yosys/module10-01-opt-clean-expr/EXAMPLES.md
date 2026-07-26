# Examples — opt_clean + opt_expr

## Track A

```bash
cd courses/learn_yosys/common
python3 -c "from algo_solvers import *; print(algo_opt_clean())"
```

IR: `tiny_algo.json` · solvers: `algo_solvers.py` · goldens: `GOLDENS` in algo_solvers.

## Pseudocode

```text
mark used nets from POs backward
drop cells whose Y/Q never used (keep mux/dff)
fold dollar buf tied to const0
ok if removed==2 and folded==1
```

## Notes

GOLDEN: opt_clean removed=2; opt_expr folded=1.
