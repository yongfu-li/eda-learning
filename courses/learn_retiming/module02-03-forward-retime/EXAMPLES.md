# Examples — Forward retiming

1. Load `tiny_retime.json` (or `../common/tiny_retime.json`)
2. Apply forward retime on a: r(a) decreases by 1; w_r = w + r(dst) − r(src); period drops to 5.

## Pseudocode

```text
forward_retime(v,r,1): r[v] -= 1; recompute all w_r
```
