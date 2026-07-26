# Examples — Real Yosys evidence engine

## Track A

```bash
cd courses/learn_yosys/common
python3 -c "from real_solvers import *; print(real_yosys_engine())"
```

RTL: `rtl/tiny_and_or.v` · scripts: `scripts/*.ys` · goldens: `evidence/goldens.json`.

## Pseudocode

```text
engine ← all real checks; ok ← recipe and stage goldens match
```

## Notes

GOLDEN: engine ok=True; after_synth_cells=2.
