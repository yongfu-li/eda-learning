---
marp: true
title: Why real OpenSTA
paginate: true
---

# Why real OpenSTA

Name liberty cells AND2/BUF/INV used by tiny_combo

---

## The idea
- GOLDEN: Liberty cells AND2, BUF, INV; linked cells=3

---

## Liberty file
![Liberty file](assets/steps/01-lib.png)

---

## AND2
![AND2](assets/steps/02-and2.png)

---

## BUF
![BUF](assets/steps/03-buf.png)

---

## INV
![INV](assets/steps/04-inv.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
- Open **liberty-vocab**
- Build the Tcl recipe or open evidence stages, then Check

---

## Implement track
- From common/, run real_solvers.py and confirm REAL_OPENSTA_OK

---

## Pitfalls
- Editing goldens by hand without re-running sta
- Confusing Part A map JSON with real liberty delays

---

## Try these
- From the common folder, run the real OpenSTA self-test

---

## Try these — try these

```
cd courses/learn_opensta/common
python3 real_solvers.py
```

---

## Pseudocode
- Here is the check in plain steps

---

## Pseudocode — try these

```
Liberty cells AND2, BUF, INV; linked cells=3.
ok if goldens match
```

---

## Next
- Complete the quiz for this part
- Continue the Part B evidence track, then wrap , algorithms and internals come later

