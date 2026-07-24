# Examples — Spec vs implementation

1. Load `tiny_equiv.json` (or `../common/tiny_equiv.json`)
2. Load spec and impl gate lists; evaluate f for all 8 assignments; see impl_good match and impl_bad differ at a=1,b=1,c=0.

## Pseudocode

```text
for each assignment in 2^|PI|: eval spec PO; eval impl PO; compare
```
