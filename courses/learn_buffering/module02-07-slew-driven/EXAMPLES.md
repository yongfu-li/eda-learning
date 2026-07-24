# Examples — Slew-driven insertion

## Try these

1. Load `../common/tiny_buf.json`.
2. Greedily insert buffers on edges whose estimated slew exceeds the limit.
3. Compare browser lab `slew-driven` with Track A.

## Pseudocode

```text
for each edge e:
  if estimate_slew(e) > limit:
    insert BUF_X1 at midpoint(e)
Output: insertions[]
Golden: limit=1 → count ≥ 1 on tiny_buf
```
