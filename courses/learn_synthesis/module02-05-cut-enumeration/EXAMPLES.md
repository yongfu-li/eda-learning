# Examples — K-feasible cut enumeration

1. Load tiny_synth.json
2. Enumerate k-feasible cuts bottom-up for each AIG node.

## Pseudocode

```text
cuts[n] ← { {n} } ∪ { c1∪c2 : |c1∪c2|≤k }
```
