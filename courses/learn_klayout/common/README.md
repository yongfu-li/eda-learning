# Track A — learn_klayout common

## Part A — KLayout viewer/stream/DRC map

IR: `tiny_klayout.json`

```bash
cd courses/learn_klayout/common
python3 solvers.py
```

Goldens: layer_count=2; shape_count=2; width_violations=1; marker_count=1; engine_ok.

**See also (theory in sibling courses):**

- layers / paint meaning → [learn_magic paint layers](../../learn_magic/module01-01-paint-layers/README.md)
- GDS write side → [learn_magic GDS write map](../../learn_magic/module03-01-gds-write-map/README.md)
- Magic DRC contrast → [learn_magic DRC map](../../learn_magic/module02-03-magic-drc-map/README.md)
- rule deck / width / spacing / markers → [learn_drc rule deck](../../learn_drc/module01-01-rule-deck/README.md), [width checker](../../learn_drc/module01-03-width-checker/README.md), [spacing checker](../../learn_drc/module01-05-spacing-checker/README.md), [violation markers](../../learn_drc/module02-03-violation-markers/README.md)

## Part B — real KLayout evidence

```bash
python3 real_solvers.py
# optional when klayout installed:
# bash scripts/run_evidence.sh
```

Checked-in: `evidence/goldens.json`, `logs/*.log`, `scripts/*.drc`.

## Part C — algorithms + bind

```bash
python3 algo_solvers.py
python3 partc_bind.py
```

IR: `tiny_algo_klayout.json` — bind to Part B width_violations=1 marker_count=1.

## Part D — internals

```bash
python3 internals_solvers.py
```

Orientation: `internals/` excerpts (layout/cell model, DRC runner, contribute).
