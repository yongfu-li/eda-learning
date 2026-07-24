# Examples — Slew / transition budget

## Try these

1. Load `../common/tiny_buf.json`.
2. Estimate transition time and check it against a slew limit.
3. Compare browser lab `slew-budget` with Track A.

## Pseudocode

```text
slew ← k × R × (C_wire + C_load)
return slew ≤ slew_limit
Golden: slew_limit=8 on tiny_buf
```
