# Examples — Clock buffering on wires

## Try these

1. Load `../common/tiny_cts.json` (or `examples/tiny_cts.json`).
2. Split long clock edges and place buffers at joints.
3. Compare browser lab `clock-buffering` with Track A solvers.

## Pseudocode

```text
Input: edge (a,b), max_span, buffer_delay
if Manhattan(a,b) ≤ max_span: return [edge], []
steps ← ceil(len / max_span)
place buffers at joints along the split
Output: sub-edges, buffers[{x,y,delay}]
Golden: (0,0)→(10,0) with max_span=4 yields >1 buffer
```
