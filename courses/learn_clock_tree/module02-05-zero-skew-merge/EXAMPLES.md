# Examples — Zero-skew merge (DME lite)

## Try these

1. Load `../common/tiny_cts.json` (or `examples/tiny_cts.json`).
2. Place a merge point that balances left/right subtree delays.
3. Compare browser lab `zero-skew-merge` with Track A solvers.

## Pseudocode

```text
Input: points a,b with subtree delays da,db
On a shared horizontal (or vertical) line:
  place merge p so da + |a−p| = db + |b−p|
Else try HV / VH elbows; pick smaller imbalance
Output: merge point p
Golden: equal da=db=0 → midpoint; demo skew≈0 on spread
```
