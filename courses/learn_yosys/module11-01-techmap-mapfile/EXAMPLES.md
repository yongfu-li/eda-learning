# Examples — techmap mapfile

## Track A

```bash
cd courses/learn_yosys/common
python3 -c "from algo_solvers import *; print(algo_techmap_mapfile())"
```

IR: `tiny_algo.json` · solvers: `algo_solvers.py` · goldens: `GOLDENS` in algo_solvers.

## Pseudocode

```text
after opt_merge
match dollar and → emit $_NAND_ then $_NOT_
ok if nand_not_count == 2
```

## Notes

GOLDEN: nand_not_count=2 (NAND + NOT).
