# Examples — RTLIL C++ model

## Track A

```bash
cd courses/learn_yosys/common
python3 -c "from internals_solvers import rtlil_cpp_model; print(rtlil_cpp_model())"
```

Sources: `internals_solvers.py` · annotated excerpts under `internals/`.

## Pseudocode

```text
Name the five RTLIL pillars and how they nest.
ok if goldens match INTERNALS_GOLDENS
```

## Notes

Part D teaches how to read and extend Yosys C++ — not a full reimplementation.
Upstream: https://github.com/YosysHQ/yosys
