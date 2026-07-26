# Examples — aigmap & synth

## Track A

```bash
cd courses/learn_yosys/common
python3 -c "from real_solvers import *; print(pass_aigmap_synth())"
```

RTL: `rtl/tiny_and_or.v` · scripts: `scripts/*.ys` · goldens: `evidence/goldens.json`.

## Pseudocode

```text
aigmap → cells=7; synth → cells=2 {$_AOI3_, $_DFF_P_}
```

## Notes

GOLDEN: aigmap cells=7; synth cells=2 types=$_AOI3_,$_DFF_P_.
