# Examples — Period bound / FEAS lite

1. Load `tiny_retime.json` (or `../common/tiny_retime.json`)
2. Use feas_check: legal r and clock_period ≤ target (5); forward on a meets target from baseline 8.

## Pseudocode

```text
feas(φ,r) ← legal(r) ∧ clock_period(r) ≤ φ
```
