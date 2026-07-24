# Examples — Latency and skew

## Try these

1. Load `../common/tiny_cts.json` (or `examples/tiny_cts.json`).
2. Compute per-sink tree latency and skew as max minus min.
3. Compare browser lab `latency-skew` with Track A solvers.

## Pseudocode

```text
Input: tree edges, source, sinks, wire_delay
for each sink s:
  path ← shortest path on tree from source to s
  L[s] ← sum Manhattan(edge) × wire_delay along path
skew ← max(L) − min(L)
Output: latencies L, skew
Golden: H-tree and MMM report finite skew on spread (see GOLDENS)
```
