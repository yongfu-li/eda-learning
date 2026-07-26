# Examples — memory_map algorithm

## Track A

```bash
cd courses/learn_yosys/common
python3 -c "from algo_solvers import *; print(algo_memory_map())"
python3 -c "from partc_bind import bind_memory; print(bind_memory())"
```

IR: `tiny_algo.json` · RTL: `rtl/tiny_mem.v` · solvers: `algo_solvers.py` · bind: `partc_bind.py` · real: `evidence/partc/goldens.json`.

## Pseudocode

```text
read memory block from tiny_algo
emit dollar mem WIDTH=width SIZE=depth
ok if depth==8 and width==4
# real: memory_collect → $mem WIDTH=4 SIZE=8
```

## Notes

GOLDEN: one dollar mem; depth=8; width=4. Real Yosys on tiny_mem: `$mem`×1, WIDTH=4, SIZE=8.
