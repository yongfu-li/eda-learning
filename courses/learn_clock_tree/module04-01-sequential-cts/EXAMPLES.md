# Examples — Sequential CTS pass

## Try these

1. Load `../common/tiny_cts.json` (or `examples/tiny_cts.json`).
2. Grow a tree by attaching sinks one-by-one to the nearest existing node.
3. Compare browser lab `sequential-cts` with Track A solvers.

## Pseudocode

```text
nodes ← [source]; edges ← []
for sink in order:
  attach L-route from nearest(nodes) to sink
  nodes += sink + new steiners
optional: insert_buffers on long edges
Output: tree, skew
Golden: six sinks connected; skew documented in GOLDENS
```
