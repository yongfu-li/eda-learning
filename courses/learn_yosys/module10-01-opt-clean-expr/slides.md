---
marp: true
title: Why opt clean
paginate: true
---

# Why opt clean

Dead logic and constant buffers waste cells; clean and fold shrink the netlist

---

## The idea
- GOLDEN: opt_clean removed=2; opt_expr folded=1

---

## Dead cells
![Dead cells](assets/steps/01-scan.png)

---

## opt_clean
![opt_clean](assets/steps/02-clean.png)

---

## opt_expr
![opt_expr](assets/steps/03-expr.png)

---

## Keep live
![Keep live](assets/steps/04-keep.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
- Open **opt-clean-expr**
- Remove dead cells and fold the const0 buffer

---

## Implement track
- Call algo_opt_clean(); assert removed_count == 2
- Call algo_opt_expr(); assert folded_count == 1

---

## Pitfalls
- Deleting live fanout
- Counting fold after clean already dropped the buffer

---

## Try these
- From the common folder, run the algo solvers self-test, or call `algo_opt_clean` directly

---

## Try these — try these

```
cd courses/learn_yosys/common
python3 algo_solvers.py
```

---

## Pseudocode
- Here is the check in plain steps

---

## Pseudocode — try these

```
mark used nets from POs backward
drop cells whose Y/Q never used (keep mux/dff)
fold dollar buf tied to const0
ok if removed==2 and folded==1
```

---

## Next
- Complete the quiz for this part
- Next: opt_merge of duplicate ANDs

