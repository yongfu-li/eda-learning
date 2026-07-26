# Examples — proc_mux algorithm

## Track A

```bash
cd courses/learn_yosys/common
python3 -c "from algo_solvers import *; print(algo_proc_mux())"
```

IR: `tiny_algo.json` · solvers: `algo_solvers.py` · goldens: `GOLDENS` in algo_solvers.

## Pseudocode

```text
for each combo process with two cases:
  emit dollar mux (S,A,B,Y)
  drop that process
ok if mux_count == 1
```

## Notes

GOLDEN: mux_count=1; type is dollar mux.
