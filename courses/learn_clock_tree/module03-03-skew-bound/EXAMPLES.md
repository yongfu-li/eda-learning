# Examples — Skew bound with buffers

## Try these

1. Load `../common/tiny_cts.json` (or `examples/tiny_cts.json`).
2. Check whether tree skew meets a numeric bound after topology/buffer choices.
3. Compare browser lab `skew-bound` with Track A solvers.

## Pseudocode

```text
Input: latencies L, bound B
return (max(L) − min(L)) ≤ B
Golden: zero-skew demo often passes B=2 on spread
```
