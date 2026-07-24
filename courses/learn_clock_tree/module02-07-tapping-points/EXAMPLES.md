# Examples — Tapping / branch points

## Try these

1. Load `../common/tiny_cts.json` (or `examples/tiny_cts.json`).
2. Identify high-degree steiner taps where the clock network branches.
3. Compare browser lab `tapping-points` with Track A solvers.

## Pseudocode

```text
Input: tree edges + steiners
degree[p] ← count incident edges for each endpoint p
taps ← { p | degree[p] ≥ 3 }  (optionally exclude pure source)
Output: tapping / branch points
Golden: MMM on spread yields ≥ 1 tap
```
