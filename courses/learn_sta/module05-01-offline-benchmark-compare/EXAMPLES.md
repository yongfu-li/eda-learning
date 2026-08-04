# Examples — Offline benchmark compare

## Platform benchmark (preferred)

Open [`platform/benchmarks/sta/index.html`](../../../platform/benchmarks/sta/index.html):

1. Preset **Hard** → **Run benchmark**.
2. Ranking is **fail first**, then |Δslack| vs gold, path match, then slack / runtime.
3. Confirm **full_setup** / **dijkstra** / **tns** / **portfolio** match gold on tiny; **approx_level** drifts.
4. **Example** → K-worst path enum → **Load example** → **Register solver**.

## Upload contract

```js
export function analyze(timing, opts = {}) {
  // opts.disableArcs, opts.setupCycles, opts.edit, opts.uncertainty
  // timing: { pins, arcs, clock }
  return {
    arrival: /* pin → arrival */,
    required: /* pin → required */,
    slackAtSink: /* number */,
    path: /* pin id[] critical path */,
    timing, // optional mutated graph (e.g. budget resize)
    detail: "my-sta",
  };
}
```

Also accepted: `export function sta(...)` or `export default ...`.

## Built-in engines

| Id | Idea |
|----|------|
| `full_setup` / `setup_hold` / `tns` | Exact propagate; hold; TNS+WNS |
| `dfs_critical` / `dijkstra` / `k_worst` | Path search / topo max / enumerate |
| `approx_level` | Level × mean delay (coarse) |
| `false_path` / `multicycle` / `uncertainty` / `sdc_combo` | SDC-lite exceptions |
| `incremental` / `full_edit` | Cone update vs full recompute after edit |
| `slew_lite` / `fanout_derate` / `early` / `late` / `pessimistic` | Delay derates / OCV-lite |
| `budget` / `budget_deep` / `eco` | Resize / ECO recover |
| `multistart` / `portfolio` | Best across engines |
