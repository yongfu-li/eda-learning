# Track A — ERC common

Toy: `tiny_erc.json` — INV/BUF/SHORT + bad nwell.

Goldens (see `solvers.GOLDENS`):
- 8 nets, 4 instances, 16 pin edges
- floating: `float_n`
- undriven input: u2.A on float_n
- multi-driven: `z` (u2.Y + u3.Y)
- supply short: short1 vdd↔vss
- well error: nw1 nwell tied to vss
- markers: 5 · engine ok

```bash
cd courses/learn_erc/common
python3 test_solvers.py
python3 -c "from solvers import erc_compare; print(erc_compare())"
```
