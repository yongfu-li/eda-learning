# Examples — Offline benchmark compare

## Platform benchmark (preferred)

Open [`platform/benchmarks/clustering/index.html`](../../../platform/benchmarks/clustering/index.html):

1. Preset **Hard** → **Run benchmark** (default).
2. Confirm **Multi-start constructive + FM** ranks above single-seed FM (terminals / cut / critical nets).
3. Click a scoreboard row to inspect the cluster view.
4. **Example** → pick Fiduccia–Mattheyses → **Load example** → **Register solver**.
5. Confirm your upload ranks above builtins and appears in the plots.

## Local harness (optional)

Compare engines on the same tiny graph:

| Engine | cutsize | notes |
|--------|---------|-------|
| greedy K=2 | 3 | `common/solvers.py` |
| spectral | 3 | |
| multilevel | 3 | |
| KL from bad seed | 12→3 | |
| FM from bad seed | 12→3 | |
| external tool (optional) | | document if missing |

## Try-these

```bash
export PYTHONPATH=../common
python ../common/solvers.py ../module01-01-affinity-metrics/examples/tiny_graph.json --k 2
python ../common/solvers.py ../module01-01-affinity-metrics/examples/tiny_graph.json --mode spectral
python ../common/solvers.py ../module01-01-affinity-metrics/examples/tiny_graph.json --mode multilevel
```

Fill the table; if no external tool, still keep the harness rows.
