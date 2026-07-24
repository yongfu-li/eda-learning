# Examples — Legal retiming

1. Load `tiny_retime.json` (or `../common/tiny_retime.json`)
2. Verify is_legal: all retimed edge weights w_r ≥ 0; forward on a passes; backward on c fails.

## Pseudocode

```text
legal(r) ← ∀e: w_r(e) ≥ 0
```
