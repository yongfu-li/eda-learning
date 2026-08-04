# Track A — learn_netgen common

## Part A — Netgen LVS compare map

IR: `tiny_netgen.json`

```bash
cd courses/learn_netgen/common
python3 solvers.py
```

Goldens: sch/lay devices=2; matched_nets=4; matched_devices=2; mismatch=0; classes=2.

## Part B — real Netgen evidence

```bash
python3 real_solvers.py
# optional when netgen installed:
# bash scripts/run_evidence.sh
```

Checked-in: `evidence/goldens.json`, `logs/*.log`, `scripts/*.tcl`.

## Part C — algorithms + bind

```bash
python3 algo_solvers.py
python3 partc_bind.py
```

IR: `tiny_algo_netgen.json` — bind to Part B matched=2/4 mismatch=0.

## Part D — internals

```bash
python3 internals_solvers.py
```

Orientation: `internals/` excerpts (netcomp model, compare flow, cmd_lvs).
