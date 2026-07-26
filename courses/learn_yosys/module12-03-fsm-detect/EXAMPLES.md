# Examples — fsm detect

## Track A

```bash
cd courses/learn_yosys/common
python3 -c "from algo_solvers import *; print(algo_fsm_detect())"
python3 -c "from partc_bind import bind_fsm; print(bind_fsm())"
```

IR: `tiny_algo.json` · RTL: `rtl/tiny_fsm.v` · solvers: `algo_solvers.py` · bind: `partc_bind.py` · real: `evidence/partc/goldens.json`.

## Pseudocode

```text
states ← fsm.states; trans ← fsm.transitions
bits ← max encoding string length
ok if 3 states and 2 encoding bits
# real: fsm_extract → $fsm STATE_NUM=3 STATE_BITS=2
```

## Notes

GOLDEN: states=3; transitions=3 (named edges); encoding_bits=2. Real Yosys TRANS_NUM includes stay-in-state edges.
