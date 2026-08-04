# Examples — Offline benchmark compare

## Platform benchmark (preferred)

Open [`platform/benchmarks/retiming/index.html`](../../../platform/benchmarks/retiming/index.html):

1. Preset **Hard** → **Run benchmark**.
2. Ranking is **illegal first**, then clock period Φ, then register count / cost.
3. Confirm **forward_a** reaches period 5 on the course graph; **enumerate** / **portfolio** should match or beat it.
4. **Example** → Enumerate r∈[-2,2] → **Load example** → **Register solver**.

## Upload contract

```js
export function retime(graph, opts = {}) {
  // graph: { nodes: [{id, delay, kind}], edges: [{id, src, dst, w}] }
  // opts.periodTarget, opts.seed
  return {
    r: /* nodeId → integer lag */,
    detail: "my-retime",
  };
}
```

Also accepted: `export default ...` or `export function run(...)`.

## Built-in engines

| Id | Idea |
|----|------|
| `identity` / `forward_a` | Baseline r=0; course forward move on `a` |
| `min_period` / `sequential` | Hand search / course sequential wrapper |
| `greedy` / `critical_push` / `cutset` | Local ±r; push on critical zero-weight path; cut moves |
| `enumerate` / `deep_enum` / `beam` | Enumerate / wider enum / beam search on lags |
| `binary_feas` / `wd_feas` | Binary Φ + enum FEAS; W/D matrices + Bellman-Ford FEAS |
| `min_registers` / `balance_regs` / `area_aware` | Regs under target; flatten w; area-weighted cost |
| `tabu` / `ils` / `genetic` / `path_sa` / `sa` / `sa_multi` | Metaheuristics on integer r |
| `period_pareto` / `multistart` / `portfolio` | Best across engines |

## Offline JSON (optional)

Load `../common/tiny_retime.json` and compare baseline vs min-period metrics offline if you are working outside the platform scoreboard.
