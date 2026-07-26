# Examples — RTLIL vocabulary

## Track A

```bash
cd courses/learn_yosys/common
python3 -c "from real_solvers import *; print(pass_rtlil_vocab())"
```

RTL: `rtl/tiny_and_or.v` · scripts: `scripts/*.ys` · goldens: `evidence/goldens.json`.

## Pseudocode

```text
load evidence; assert modules=2; processes=1; cells[$and]=2
```

## Notes

GOLDEN: after_read modules=2 processes=1 and_count=2; vocab includes $and $or $not $dff.
