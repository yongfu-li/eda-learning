# Track A — retiming

Shared helpers for **learn_retiming** (Leiserson–Saxe literacy).

| File | Role |
|------|------|
| `tiny_retime.json` | Toy sequential graph (PI u → a → b → c → PO v, plus a→c) |
| `retimeutil.py` | `load`, `total_registers`, `edge_list` |
| `solvers.py` | `w_r`, forward/backward, `clock_period`, `min_period_binary_search` |
| `test_solvers.py` | Unit tests / goldens |

## Toy goldens

| Metric | Value |
|--------|-------|
| Nodes / edges | 5 / 5 |
| Baseline registers | **2** (e0, e2) |
| Baseline clock period | **8** |
| Target period φ | **5** |
| Best move (lite search) | forward on **a** → period **5**, registers **3** |
| `w_r` formula | `w + r(dst) − r(src)` |

```bash
python3 test_solvers.py -v
```
