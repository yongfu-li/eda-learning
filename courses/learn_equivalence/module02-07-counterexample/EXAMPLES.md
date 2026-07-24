# Examples — Counterexample debug

1. Load `tiny_equiv.json` (or `../common/tiny_equiv.json`)
2. Use find_counterexample and read spec vs impl PO values at a=1,b=1,c=0; trace mismatched miter XOR.

## Pseudocode

```text
cex ← first asn where eval(spec)≠eval(impl); report PO values
```
