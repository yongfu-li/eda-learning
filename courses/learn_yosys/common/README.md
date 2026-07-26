# Track A — Yosys common

## Part A — pass map

IR: `tiny_yosys.json` — AND/OR/dup-AND/dead-BUF/NOT/DFF across top+child. Interactive pass map (same names as Yosys).

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

## Part C — algorithms (+ real bind)

IR: `tiny_algo.json` · RTL: `tiny_algo.v`, `tiny_extract.v`/`andor2_map.v`, `tiny_mem.v`, `tiny_fsm.v` · solvers: `algo_solvers.py` · bind: `partc_bind.py` · evidence: `evidence/partc/goldens.json`.

```bash
cd courses/learn_yosys/common
bash scripts/run_partc_evidence.sh
python3 scripts/build_partc_goldens.py
python3 algo_solvers.py
python3 partc_bind.py
```

Real bind stages: proc → opt → techmap → extract (ANDOR2) → memory ($mem 4×8) → fsm ($fsm) → abc/aigmap.

## Part D — internals / contribute

Solvers: `internals_solvers.py` · excerpts: `internals/` (hello_pass stub, opt_clean flow notes).

```bash
cd courses/learn_yosys/common
python3 internals_solvers.py
```

Orientation only — open the upstream Yosys tree with intent; do not expect a full C++ clone in the browser.
