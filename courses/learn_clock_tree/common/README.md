# Track A — clock tree synthesis

| File | Role |
|------|------|
| `tiny_cts.json` | 12×8 chip, source placement, CLK at (6,4) |
| `ctsutil.py` | sink_points, manhattan, load |
| `solvers.py` | H-tree, MMM, zero-skew merge, buffers, sequential CTS |
| `test_solvers.py` | Unit tests |

```bash
python3 test_solvers.py
```
