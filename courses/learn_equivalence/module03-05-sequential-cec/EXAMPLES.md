# Examples — Sequential CEC lite

1. Load `tiny_equiv.json` (or `../common/tiny_equiv.json`)
2. Run sequential_cec_lite for 2 steps: spec≡impl_good True; spec≡impl_bad False (next_q=NOT q ignores a).

## Pseudocode

```text
for each input sequence length n: simulate spec & impl; compare output vectors
```
