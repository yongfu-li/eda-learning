# common/ — Track A SPICE-lite solvers

Load `tiny_spice.json`. See `solvers.py`.

```bash
cd courses/learn_spice/common
python3 test_solvers.py -v
```

Goldens: divider V2=3.0, MNA size 3, nnz 6, NR linear 1 iter, BE TRAN final≈2.255, diode 1-D NR converges.
