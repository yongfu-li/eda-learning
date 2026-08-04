# Track A — learn_drc common

```bash
cd courses/learn_drc/common
python3 solvers.py
```

IR: `tiny_drc.json` (shapes + rule deck). Helpers: `drcutil.py`. Solvers: `load_deck`, `check_width`, `check_spacing`, `check_enclosure`, `check_boolean`, `collect_violations`, `drc_engine`.

Goldens: 8 rules; width D; space A–B; enclosure V vs M2; boolean V; engine violations=3 + boolean hit; `ok=True`.
