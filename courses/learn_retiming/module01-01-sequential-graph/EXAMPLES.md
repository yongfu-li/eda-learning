# Examples — Sequential circuit graph

1. Load `tiny_retime.json` (or `../common/tiny_retime.json`)
2. Read the sequential graph: PI u, comb nodes a/b/c, PO v, and fanout edge a→c.

## Pseudocode

```text
nodes ← PI/comb/PO; edges ← (src,dst,w)
```
