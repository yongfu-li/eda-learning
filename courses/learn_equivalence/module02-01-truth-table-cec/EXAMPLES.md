# Examples — Truth-table CEC

1. Load `tiny_equiv.json` (or `../common/tiny_equiv.json`)
2. Run truth_table_cec: spec≡impl_good True over 8 rows; spec≡impl_bad False with counterexample a=1,b=1,c=0.

## Pseudocode

```text
for asn in all_assignments: if eval(spec,asn)≠eval(impl,asn): return cex
```
