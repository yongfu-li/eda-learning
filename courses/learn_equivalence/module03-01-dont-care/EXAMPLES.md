# Examples — Don't-care CEC

1. Load `tiny_equiv.json` (or `../common/tiny_equiv.json`)
2. Apply dont_care_mask: treat some PI bits as X; CEC only over care assignments (e.g. c=0 slice).

## Pseudocode

```text
skip rows violating care mask; CEC on remaining assignments only
```
