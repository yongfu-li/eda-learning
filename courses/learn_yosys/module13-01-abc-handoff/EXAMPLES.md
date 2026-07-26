# Examples — ABC handoff

## Track A

```bash
cd courses/learn_yosys/common
python3 -c "from algo_solvers import *; print(algo_abc_handoff())"
python3 -c "from partc_bind import bind_abc; print(bind_abc())"
```

IR: `tiny_algo.json` · RTL: `rtl/tiny_algo.v` · solvers: `algo_solvers.py` · bind: `partc_bind.py` · real: `evidence/partc/goldens.json`.

## Pseudocode

```text
after opt_merge
and += 1 per dollar and; += 2 per dollar mux
ok if aig_ands == 3
# real: aigmap → $_AND_/$_NOT_ (ABC-bound AIG)
```

## Notes

GOLDEN: abc_aig_ands=3 (abstract teach count). Real aigmap on tiny_algo emits `$_AND_`×10 / `$_NOT_`×12 — the handoff shape ABC consumes.
