# Track A — Yosys common

## Part A — toy literacy

Toy: `tiny_yosys.json` — AND/OR/dup-AND/dead-BUF/NOT/DFF across top+child.

```bash
cd courses/learn_yosys/common
python3 -c "from solvers import yosys_compare; print(yosys_compare())"
```

## Part B — real Yosys evidence

RTL: `rtl/tiny_and_or.v` · scripts: `scripts/*.ys` · logs: `logs/` · goldens: `evidence/goldens.json`.

```bash
# Requires yosys on PATH (optional — goldens are checked in)
bash scripts/run_evidence.sh
python3 scripts/build_evidence_goldens.py
python3 -c "from real_solvers import real_yosys_compare; print(real_yosys_compare())"
```

Goldens (Yosys 0.9 on tiny_and_or): after_read modules=2 processes=1 and=2; after_proc has $dff; flatten cells=4; aigmap cells=7; synth cells=2 (`$_AOI3_`, `$_DFF_P_`).
