# Examples — H-tree topology

## Try these

1. Load `../common/tiny_cts.json` (or `examples/tiny_cts.json`).
2. Build a recursive H-tree from the source covering sink clusters.
3. Compare browser lab `h-tree` with Track A solvers.

## Pseudocode

```text
Input: source, sink points
build(pts, root, horizontal):
  if |pts|=1: connect root→pts[0]; return
  split pts by median x (or y if vertical)
  place steiners toward each half; recurse alternating axis
Output: edges + steiners
Golden: connects all six sinks on spread; finite skew
```
