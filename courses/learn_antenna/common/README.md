# Track A — Antenna common

Toy: `tiny_antenna.json` — gates g1–g3, metals m1–m3b, diode on n3.

Goldens:
- n1 ratio 25 (fail), n2 ratio 4 (pass), n3 ratio 45 but diode-protected
- violations after diode: 1 (`n1`)
- jumper on n1 (max_layer=1) → ratio 0
- markers: 1 · engine ok

```bash
cd courses/learn_antenna/common
python3 test_solvers.py
python3 -c "from solvers import antenna_compare; print(antenna_compare())"
```
