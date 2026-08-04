# Examples — Offline benchmark compare

## Platform benchmark (preferred)

Open [`platform/benchmarks/placement/index.html`](../../../platform/benchmarks/placement/index.html):

1. Preset **Hard** → **Run benchmark**.
2. Ranking is **Σ dens first** (3×3 bins, cap 1), then cost / HPWL — collapse no longer wins.
3. Confirm **dens Pareto** / **legalize-aware** / **dens-SA** beat identity on dens+cost.
4. **Example** → Density-penalized SA → **Load example** → **Register solver**.

## Upload contract

```js
export function place(positions, opts = {}) {
  // opts.fixed, opts.nets, opts.weights
  return { positions: /* new coords */, detail: "my-placer" };
}
```

## Built-in engines

| Id | Idea |
|----|------|
| `force` / `force_deep` | Spring pull along net edges |
| `force_spread` | Force then pairwise min-distance |
| `dens_force` | Springs + bin repulsion + minΔ |
| `timing_force` | Weight critical net (×5) harder |
| `quadratic` / `analytical` | Course pads A,D solvers |
| `sa` / `sa_deep` / `sa_multi` | Annealing on HPWL |
| `dens_sa` / `dens_sa_multi` | Annealing on HPWL+λ·overflow |
| `legalize_aware` | Dens-force → spread → dens-SA |
| `dens_pareto` | Best under dens≤1 (else min dens) |
| `portfolio` | Min dens then HPWL across the above |
| `golden` | Compact reference (HPWL 14) |
