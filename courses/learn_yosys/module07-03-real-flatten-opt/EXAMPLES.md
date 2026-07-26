# Examples — Real flatten & opt

## Track A

```bash
cd courses/learn_yosys/common
python3 -c "from real_solvers import *; print(pass_real_flatten_opt())"
```

RTL: `rtl/tiny_and_or.v` · scripts: `scripts/*.ys` · goldens: `evidence/goldens.json`.

## Pseudocode

```text
flatten → modules=1 cells=4; opt → cells=4 and_count=1
```

## Notes

GOLDEN: flatten modules=1 cells=4; opt cells=4 and_count=1.
