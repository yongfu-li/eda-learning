# Examples — Local AIG rewrite

1. Load tiny_synth.json
2. Detect rewrite opportunities (complements, AND children) and both-comp → NOR mapping hints.

## Pseudocode

```text
if both fanins complemented: suggest NOR mapping
```
