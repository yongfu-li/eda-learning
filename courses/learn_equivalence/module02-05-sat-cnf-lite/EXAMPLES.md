# Examples — SAT / CNF encoding lite

1. Load `tiny_equiv.json` (or `../common/tiny_equiv.json`)
2. encode_sat_cnf_lite with Tseitin clauses; report num_vars and num_clauses; optional tiny DPLL satisfiability.

## Pseudocode

```text
for each gate: add Tseitin clauses linking inputs → output var
```
