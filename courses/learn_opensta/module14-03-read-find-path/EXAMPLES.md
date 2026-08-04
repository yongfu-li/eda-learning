# Examples — Read find_path / report

## Track A

```bash
cd courses/learn_opensta/common
python3 -c "from internals_solvers import read_find_path; print(read_find_path())"
```

Sources: `internals_solvers.py` · annotated excerpts under `internals/`.

## Pseudocode

```text
tag_endpoints → walk_back → emit_path → report_checks (slack 8).
ok if goldens match INTERNALS_GOLDENS
```

## Notes

Part D teaches how to read and extend OpenSTA C++ — not a full reimplementation.
Upstream: https://github.com/The-OpenROAD-Project/OpenSTA
