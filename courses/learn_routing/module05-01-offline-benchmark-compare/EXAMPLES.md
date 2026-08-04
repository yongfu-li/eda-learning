# Examples — Offline benchmark compare

## Platform benchmark (preferred)

Open [`platform/benchmarks/detailed-routing/index.html`](../../../platform/benchmarks/detailed-routing/index.html):

1. Preset **Hard** → **Run benchmark**.
2. Confirm **Strong negotiated** / **topo rip-up** / **A*** cut Σ track overflow vs plain L-HV.
3. Compare Lee vs A* and rip-up on wirelength.
4. **Example** → Strong negotiated → **Load example** → **Register solver**.

## Upload contract

```js
export function route(instance, opts) {
  // instance.positions, instance.trackCapacity, instance.nets
  return {
    routes: [
      {
        netIndex: 0,
        net: ["A", "B"],
        segments: [
          { x: 1, y: 1, layer: "M1" },
          { x: 2, y: 1, layer: "M1" },
          // …
        ],
      },
    ],
    detail: "my-router",
  };
}
```

## Built-in engines

| Id | Idea |
|----|------|
| `lee` / `astar` | Course sequential routers |
| `adaptive_l` | Per-net HV vs VH by overflow delta |
| `pressure_first` | Route high predicted-pressure nets first |
| `hybrid` | Per-net best of L / Lee / A* |
| `steiner` | Multipin with multi-center A* star |
| `astar_ripup` / `l_ripup` | Seed + repeated rip-up |
| `astar_topo` / `adapt_topo` | Rip-up trying L / Lee / A* |
| `bulk_ripup` | Rip all nets on hot tracks, hybrid re-place |
| `negotiated` / `strong_neg` | PathFinder-lite history costs |
| `cap_hard` | Steep Cap=1 negotiated + pressure order |
| `portfolio` | Min overflow then wirelen across the above |
