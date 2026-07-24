# Examples — Clock sinks from placement

## Try these

1. Load `../common/tiny_cts.json` (or `examples/tiny_cts.json`).
2. Map placement centers to clock sinks and locate the chip-center source.
3. Compare browser lab `clock-sinks` with Track A solvers.

## Pseudocode

```text
Input: placement map, sink ids [A..F], source (sx,sy)
for each id in sinks:
  sinks.append({id, x: placement[id].x, y: placement[id].y})
Output: sink list + fixed clock source
Golden: six sinks; source (6,4) on 12×8 chip
```
