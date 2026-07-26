# Track A — Power common

Toy: `tiny_power.json` — 3 nets + series IR path src→a→b→sink.

Goldens:
- Psw n1=1.0, chip Ptot=5.55
- IR drop at sink=0.4 (> limit 0.3)
- EM: I=0.1 > 0.08 on 3 edges
- markers=4 · engine ok

```bash
cd courses/learn_power/common
python3 test_solvers.py
python3 -c "from solvers import power_compare; print(power_compare())"
```
