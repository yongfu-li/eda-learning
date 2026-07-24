# Examples — Wire R/C model

## Try these

1. Load `../common/tiny_buf.json`.
2. Compute lumped R and C from Manhattan length on each net edge.
3. Compare browser lab `wire-rc` with Track A.

## Pseudocode

```text
Input: length L, r_per, c_per
R ← L × r_per;  C ← L × c_per
delay ← R × (C/2 + C_load)   # Elmore lumped
Output: {R, C, length}
Golden: L=4 → R=4, C=4 with unit parasitics
```
