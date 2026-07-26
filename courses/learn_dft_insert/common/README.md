# Track A — DFT insert common

Toy: `tiny_dft.json` — 4 flops, full-scan order f1→f2→f3→f4, lockup d0→d1 (f3→f4).

Goldens:
- 4 scan cells, 3 stitches, chain length 4
- 1 lockup, transform edges=6 (SI + 3 stitches + SO + lockup)
- markers=1 · engine ok

```bash
cd courses/learn_dft_insert/common
python3 test_solvers.py
python3 -c "from solvers import dft_compare; print(dft_compare())"
```
