# Examples — proc_dff + async reset

## Track A

```bash
cd courses/learn_yosys/common
python3 -c "from algo_solvers import *; print(algo_proc_dff())"
python3 partc_bind.py
```

IR: `tiny_algo.json` · RTL: `rtl/tiny_algo.v` · solvers: `algo_solvers.py` · bind: `partc_bind.py` · real goldens: `evidence/partc/goldens.json`.

## Pseudocode

```text
run proc_mux first
for each sync process:
  if reset present: emit $adff (CLK,D,Q,ARST)
  else: emit $dff (CLK,D,Q)
ok if reg_type==$adff and processes==0
```

## Notes

GOLDEN: one `$adff` with arst; processes left = 0. Real Yosys after_proc on tiny_algo: `$adff`×1, `$mux`×1.
