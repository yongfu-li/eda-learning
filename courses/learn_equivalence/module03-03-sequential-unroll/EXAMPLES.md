# Examples — Sequential unrolling

1. Load `tiny_equiv.json` (or `../common/tiny_equiv.json`)
2. Unroll sequential pair for n=2: PIs a_0,a_1 plus q_0; expose combo clouds per cycle.

## Pseudocode

```text
for t in 0..n-1: duplicate combo cloud; wire q_{t+1} ← D_t
```
