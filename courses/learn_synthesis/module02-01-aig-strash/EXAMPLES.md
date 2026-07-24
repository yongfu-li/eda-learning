# Examples — Structural hashing (strash)

1. Load tiny_synth.json
2. Build a structural hash table keyed by sorted AND fanin literals.

## Pseudocode

```text
key ← sorted(lit0, lit1); table[key]=node
```
