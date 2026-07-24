# Track A — equivalence checking

Shared helpers for **learn_equivalence** (CEC literacy).

| File | Role |
|------|------|
| `tiny_equiv.json` | Toy spec/impl pairs (comb + sequential) |
| `equivutil.py` | `load`, `evaluate_circuit`, `truth_table` |
| `solvers.py` | `build_miter`, `truth_table_cec`, `structural_hash_stats`, `encode_sat_cnf_lite`, `sequential_cec_lite` |
| `test_solvers.py` | Unit tests / goldens |

## Toy goldens

| Metric | Value |
|--------|-------|
| PI count (comb) | 3 → **8** truth-table rows |
| Spec | f = **(a∧b)∨c** |
| spec ≡ impl_good | **True** (all 8 rows) |
| spec ≡ impl_bad | **False** — cex **a=1, b=1, c=0** |
| Miter (good pair) | PO = **0** for all inputs |
| Sequential (2-step) | spec ≡ impl_good **True**; impl_bad **False** |

```bash
python3 test_solvers.py -v
```
