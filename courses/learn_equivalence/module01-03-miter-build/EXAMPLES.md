# Examples — Miter construction

1. Load `tiny_equiv.json` (or `../common/tiny_equiv.json`)
2. Build a miter: shared PIs, XOR of spec PO and impl PO; miter PO=0 for all inputs when equivalent.

## Pseudocode

```text
miter ← shared PI spec ∥ impl; PO_miter ← spec_PO XOR impl_PO
```
