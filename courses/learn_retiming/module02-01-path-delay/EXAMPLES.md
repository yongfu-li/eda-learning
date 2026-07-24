# Examples — Zero-weight path delay

1. Load `tiny_retime.json` (or `../common/tiny_retime.json`)
2. Compute clock period as longest zero-weight path delay; baseline period GOLDEN = 8; target = 5.

## Pseudocode

```text
period ← max delay on paths using only w=0 edges; baseline=8
```
