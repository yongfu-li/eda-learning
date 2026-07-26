# Examples — Yosys CLI & scripts

## Track A

```bash
cd courses/learn_yosys/common
python3 -c "from real_solvers import *; print(pass_cli_check())"
```

RTL: `rtl/tiny_and_or.v` · scripts: `scripts/*.ys` · goldens: `evidence/goldens.json`.

## Pseudocode

```text
recipe ← []; append read_verilog; hierarchy; proc; ok ← prefix matches golden
```

## Notes

GOLDEN: first three cmds = read_verilog, hierarchy, proc; invoke with yosys -s script.ys.
