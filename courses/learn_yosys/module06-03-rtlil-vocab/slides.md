---
marp: true
title: Why rtlil
paginate: true
---

# Why rtlil

Yosys stores designs in RTLIL , modules, wires, processes, and $-typed cells you see in dump/stat

---

## The idea
- GOLDEN: after_read modules=2 processes=1 and_count=2; vocab includes $and $or $not $dff

---

## Two modules
![Two modules](assets/steps/01-mods.png)

---

## Process in child
![Process in child](assets/steps/02-proc.png)

---

## $and×2
![$and×2](assets/steps/03-and.png)

---

## $or and $not
![$or and $not](assets/steps/04-ornot.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
- Open **rtlil-vocab**
- Open **rtlil-vocab**
- Show read_hierarchy stage; select $and

---

## Implement track
- Call pass_rtlil_vocab(); assert ok and and_count==2

---

## Pitfalls
- Calling RTLIL 'gates' without $ prefix
- Ignoring processes

---

## Try these
- From the common folder

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
load evidence after hierarchy
assert modules=2 processes=1 and=2
```

---

## Next
- Complete the quiz for this part
- Next: real proc

