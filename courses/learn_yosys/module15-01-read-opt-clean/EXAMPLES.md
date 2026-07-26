# Examples — Read opt_clean

## Track A

```bash
cd courses/learn_yosys/common
python3 -c "from internals_solvers import read_opt_clean; print(read_opt_clean())"
```

Sources: `internals_solvers.py` · annotated excerpts under `internals/`.

## Pseudocode

```text
Trace mark_used then rm cells then rm wires.
ok if goldens match INTERNALS_GOLDENS
```

## Notes

Part D teaches how to read and extend Yosys C++ — not a full reimplementation.
Upstream: https://github.com/YosysHQ/yosys
