# Examples — Techmapping cover (area)

1. Load tiny_synth.json
2. Map each AND to AND2/NOR2 and charge INV for complemented edges; report area.

## Pseudocode

```text
for each AND: pick AND2 or NOR2; area += cell + INVs
```
