# Examples — Offline benchmark compare

## Platform benchmark (preferred)

Open [`platform/benchmarks/global-routing/index.html`](../../../platform/benchmarks/global-routing/index.html):

1. Preset **Hard** → **Run benchmark**.
2. Confirm **Strong negotiated** / **topo rip-up** cut Σ edge overflow vs plain L-HV and prior rip-up.
3. Compare maze orderings and multistart on wirelength.
4. **Example** → Strong negotiated → **Load example** → **Register solver**.

## Built-in engines (beyond course L / maze)

| Id | Idea |
|----|------|
| `adaptive_l` | Per-net HV vs VH by overflow delta |
| `shortest_first` | Maze in ascending HPWL order |
| `adapt_ripup` | Adaptive L seed + maze rip-up |
| `l_topo` / `adapt_topo` | Rip-up that tries L / Z / maze topologies |
| `negotiated` | PathFinder-lite history costs |
| `neg_topo` | Negotiated seed + topology rip-up |
| `strong_neg` | Multi-order PathFinder + decay + topo polish |
| `multistart` | Best of several maze / adaptive / negotiated seeds |
| `portfolio` | Min overflow then wirelen across the above |
