# common/ — Track A multi-patterning solvers

Load `tiny_mp.json`. See `solvers.py`.

```bash
cd courses/learn_multi_patterning/common
python3 test_solvers.py -v
```

Goldens: 6 features, 5 conflicts, DP fails (triangle), TP uses 3 masks, stitch restores DP, SADP mandrels=3.
