# Examples — Structural hash / FRAIG lite

1. Load `tiny_equiv.json` (or `../common/tiny_equiv.json`)
2. Compute structural_hash_stats / fraig_lite: hash (op, child hashes); count unique vs redundant nodes.

## Pseudocode

```text
hash(node) ← op + sorted(hash(children)); unique ← |distinct hashes|
```
