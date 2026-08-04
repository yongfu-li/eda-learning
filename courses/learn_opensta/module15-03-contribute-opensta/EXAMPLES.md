# Examples — Contribute to OpenSTA

## Track A

```bash
cd courses/learn_opensta/common
python3 -c "from internals_solvers import contribute_opensta; print(contribute_opensta())"
```

Sources: `internals_solvers.py` · annotated excerpts under `internals/`.

## Pseudocode

```text
app/HelloCmd.cc + Tcl register + CMake + sta -help.
ok if goldens match INTERNALS_GOLDENS
```

## Notes

Part D teaches how to read and extend OpenSTA C++ — not a full reimplementation.
Upstream: https://github.com/The-OpenROAD-Project/OpenSTA
