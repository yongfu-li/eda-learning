# Track A — learn_magic common

## Part A — Magic layout / DRC / GDS map

IR: `tiny_magic.json`

```bash
cd courses/learn_magic/common
python3 solvers.py
```

Goldens: 6 rects; metal1 paint=2; contact=1; DRC width error on `thin`; GDS map 6 layers; engine ok.

## Part B — real Magic CLI evidence

Checked-in goldens/logs (Magic binary optional):

```bash
cd courses/learn_magic/common
python3 real_solvers.py
# optional when magic installed:
# bash scripts/run_evidence.sh
```

Files: `evidence/goldens.json`, `logs/*.log`, `scripts/*.tcl`

Teaching goldens on `tiny_inv`: DRC=1 (thin metal1), GDS layers=6, contact=1.

## Part C — algorithms + bind

```bash
python3 algo_solvers.py
python3 partc_bind.py
```

IR: `tiny_algo_magic.json` — connectivity, DRC region, extract; bound to Part B goldens.

## Part D — internals / contribute

```bash
python3 internals_solvers.py
```

Pillars: Tile / Plane / CellDef. DRC/cifwrite flow + contribute checklist. See `internals/`.
