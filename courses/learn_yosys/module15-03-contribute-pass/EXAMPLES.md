# Examples — Contribute a pass

## Track A

```bash
cd courses/learn_yosys/common
python3 -c "from internals_solvers import contribute_pass; print(contribute_pass())"
```

Sources: `internals_solvers.py` · annotated excerpts under `internals/`.

## Pseudocode

```text
passes/<area>/<name>.cc + Makefile + REGISTER_PASS.
ok if goldens match INTERNALS_GOLDENS
```

## Notes

Part D teaches how to read and extend Yosys C++ — not a full reimplementation.
Upstream: https://github.com/YosysHQ/yosys
