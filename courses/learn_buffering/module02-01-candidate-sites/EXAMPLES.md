# Examples — Buffer candidate sites

## Try these

1. Load `../common/tiny_buf.json`.
2. Enumerate candidate buffer locations every step units along each edge.
3. Compare browser lab `candidate-sites` with Track A.

## Pseudocode

```text
for each edge (a→b):
  for dist = step, 2·step, … < length(a,b):
    place site at fraction dist/length along edge
Output: sites[{id,edge,x,y}]
Golden: step=2 yields ≥1 site on tiny_buf
```
