---
marp: true
title: Why real
paginate: true
---

# Why real

Real proc lowers Verilog processes into RTLIL cells , the child always block becomes $dff

---

## The idea
- GOLDEN: after_proc processes=0 has_dff=True; types include $dff

---

## Before: process
![Before: process](assets/steps/01-before.png)

---

## proc runs
![proc runs](assets/steps/02-run.png)

---

## Processes cleared
![Processes cleared](assets/steps/03-clear.png)

---

## $dff present
![$dff present](assets/steps/04-dff.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
- Open **real-proc**
- Open **real-proc**
- Show proc stage; confirm $dff and processes=0

---

## Implement track
- Call pass_real_proc(); assert ok

---

## Pitfalls
- Confusing toy pass_proc with real proc
- Expecting $dff before proc

---

## Try these
- From the common folder, run the real solvers self-test, or call `pass_real_proc` directly

---

## Try these — try these

```
cd courses/learn_yosys/common
python3 real_solvers.py
```

---

## Pseudocode
- Here is the check in plain steps

---

## Pseudocode — try these

```
run proc
assert processes=0 and dff present
```

---

## Next
- Complete the quiz for this part
- Next: flatten + opt

