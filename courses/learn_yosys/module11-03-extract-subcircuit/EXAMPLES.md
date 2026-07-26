# Examples — extract subcircuit

## Track A

```bash
cd courses/learn_yosys/common
python3 -c "from algo_solvers import *; print(algo_extract_iso())"
python3 -c "from partc_bind import bind_extract; print(bind_extract())"
```

IR: `tiny_algo.json` · RTL: `rtl/tiny_extract.v` + `rtl/andor2_map.v` · solvers: `algo_solvers.py` · bind: `partc_bind.py`.

## Pseudocode

```text
find $and → $or isomorphic to ANDOR2
replace with ANDOR2 macro cell
ok if matches==1
# real: extract -map andor2_map.v → ANDOR2×1
```

## Notes

GOLDEN: extract matches=1 ANDOR2. Real Yosys on tiny_extract: one `ANDOR2` cell after extract.
