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

## Part C — algorithms bound to Part B goldens

IR: `tiny_algo_sta.json` · solvers: `algo_solvers.py` · bind: `partc_bind.py`.

```bash
cd courses/learn_opensta/common
python3 algo_solvers.py && python3 partc_bind.py
```

Goldens: path `b→n1→n2→y`, delay=2.0, slack=8.0 (matches Part B `report_checks`).

## Part D — internals / contribute

Solvers: `internals_solvers.py` · excerpts: `internals/` (tree map, find_path.flow.md, hello_cmd.excerpt.cc).

```bash
cd courses/learn_opensta/common
python3 internals_solvers.py
```

Goldens: 4 pillars (Network/Graph/Sdc/Search); FindPath stages bind to Part B slack=8; contribute path `app/HelloCmd.cc`.

