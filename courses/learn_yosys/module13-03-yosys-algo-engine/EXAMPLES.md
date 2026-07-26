# Examples — Yosys algo engine

## Track A

```bash
cd courses/learn_yosys/common
python3 -c "from algo_solvers import *; print(yosys_algo_engine())"
```

IR: `tiny_algo.json` · solvers: `algo_solvers.py` · goldens: `GOLDENS` in algo_solvers.

## Pseudocode

```text
run mux, dff, clean, expr, merge, techmap, extract, memory, fsm, abc
ok if every golden matches
```

## Notes

GOLDEN: yosys_algo_engine ok=True (all Part C goldens).
