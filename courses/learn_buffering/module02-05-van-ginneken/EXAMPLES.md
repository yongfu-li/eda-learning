# Examples — Van Ginneken DP lite

## Try these

1. Load `../common/tiny_buf.json`.
2. Generate (cap, delay) options, prune dominated, pick best buffer/wire choice.
3. Compare browser lab `van-ginneken` with Track A.

## Pseudocode

```text
options ← [wire_only(c,d)]
for buf in library:
  options += mid_buffer_option(buf)
pruned ← dominate_prune(options)  # rising c, keep falling d
best ← argmin delay in pruned
Golden: best_delay ≤ wire_delay on tiny_buf
```
