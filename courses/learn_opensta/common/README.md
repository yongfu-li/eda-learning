# Track A — OpenSTA common

## Part A — timing / report map

IR: `tiny_opensta.json`

```bash
cd courses/learn_opensta/common
python3 solvers.py
```

## Part B — real OpenSTA evidence

RTL: `rtl/tiny_combo.v` · liberty: `lib/tiny_opensta_lib.lib` · scripts: `scripts/*.tcl` · logs: `logs/` · goldens: `evidence/goldens.json`.

```bash
# Requires sta on PATH (optional — goldens are checked in)
bash scripts/run_evidence.sh
python3 real_solvers.py
```

Goldens (OpenSTA 3.1.0 on tiny_combo): cells=3; clock clk period=10; path delay=2.0; slack=8.0 MET at endpoint y.

## Part C / D

Planned — algorithms + internals.
