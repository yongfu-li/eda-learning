# Examples — Read DRC / cifwrite

## Track A

```bash
cd courses/learn_magic/common
python3 -c "from internals_solvers import read_drc_cifwrite; print(read_drc_cifwrite())"
```

Sources: `internals_solvers.py` · annotated excerpts under `internals/`.

## Pseudocode

```text
load_rules → scan_region → emit_marker (drc=1); cifwrite stages.
ok if goldens match INTERNALS_GOLDENS
```
