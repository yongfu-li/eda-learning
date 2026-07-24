# Examples — Polarity / inverter pairs

## Try these

1. Load `../common/tiny_buf.json`.
2. Track polarity flips from INV cells and restore positive sense when required.
3. Compare browser lab `polarity-invert` with Track A.

## Pseudocode

```text
flips ← count of cells with invert=true on path
positive ← (flips mod 2 == 0)
Golden: [INV_X1] → flips=1, positive=false
```
