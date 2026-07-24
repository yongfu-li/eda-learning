# Examples — Fanout buffer tree

## Try these

1. Load `../common/tiny_buf.json`.
2. Insert a junction buffer when sink fanout exceeds a max_fanout limit.
3. Compare browser lab `fanout-tree` with Track A.

## Pseudocode

```text
if |sinks| > max_fanout:
  insert BUF_X2 at junction (S0)
Output: buffers, inserted flag
Golden: 3 sinks, max_fanout=2 → inserted
```
