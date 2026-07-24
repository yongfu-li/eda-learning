# Examples — Backward retiming

1. Load `tiny_retime.json` (or `../common/tiny_retime.json`)
2. Apply backward retime on c: r(c) increases; e3 c→v gets w_r = −1 → illegal retiming.

## Pseudocode

```text
backward_retime(v,r,1): r[v] += 1; legal iff all w_r ≥ 0
```
