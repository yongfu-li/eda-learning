# Examples — Pass registration

## Track A

```bash
cd courses/learn_yosys/common
python3 -c "from internals_solvers import pass_registration; print(pass_registration())"
```

Sources: `internals_solvers.py` · annotated excerpts under `internals/`.

## Pseudocode

```text
Order: subclass Pass → REGISTER_PASS → execute(args, design).
ok if goldens match INTERNALS_GOLDENS
```

## Notes

Part D teaches how to read and extend Yosys C++ — not a full reimplementation.
Upstream: https://github.com/YosysHQ/yosys
