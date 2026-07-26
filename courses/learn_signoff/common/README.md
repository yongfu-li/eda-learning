# Track A — Signoff common

Toy: `tiny_signoff.json` — 3 corners, 6 checks (STA+Antenna fail), 2 ECOs, tapeout checklist.

Goldens:
- signoff corner ss_0p9_125 derate 1.1
- fail_count=2 → after ECO fail_count=0
- tapeout ready only after ECO
- markers=2 · engine ok

```bash
cd courses/learn_signoff/common
python3 test_solvers.py
python3 -c "from solvers import signoff_compare; print(signoff_compare())"
```
