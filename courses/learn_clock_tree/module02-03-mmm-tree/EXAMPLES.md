# Examples — Method of Means and Medians

## Try these

1. Load `../common/tiny_cts.json` (or `examples/tiny_cts.json`).
2. Build an MMM-style tree by merging closest fragments at midpoints.
3. Compare browser lab `mmm-tree` with Track A solvers.

## Pseudocode

```text
fragments ← each sink as root
while |fragments| > 1:
  pick closest pair (f1,f2) by Manhattan(root)
  merge ← midpoint(f1.root, f2.root)
  edges += merge→f1.root, merge→f2.root
  replace pair with merged fragment
connect source → final.root
Output: edges + steiners
Golden: all sinks reachable; skew documented in GOLDENS
```
