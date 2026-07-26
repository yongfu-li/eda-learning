# Examples — Real proc pass

## Track A

```bash
cd courses/learn_yosys/common
python3 -c "from real_solvers import *; print(pass_real_proc())"
```

RTL: `rtl/tiny_and_or.v` · scripts: `scripts/*.ys` · goldens: `evidence/goldens.json`.

## Pseudocode

```text
before ← processes>0; proc; after ← processes=0 and $dff in types
```

## Notes

GOLDEN: after_proc processes=0 has_dff=True; types include $dff.
