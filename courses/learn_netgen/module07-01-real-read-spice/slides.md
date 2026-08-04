---
marp: true
title: Why real Netgen
paginate: true
---

# Why real Netgen

Read tiny_inv schematic and layout SPICE

---

## The idea
- GOLDEN: sch_devices=2; lay_devices=2; nets=4

---

## Schematic
![Schematic](assets/steps/01-sch.png)

---

## Layout
![Layout](assets/steps/02-lay.png)

---

## Four nets
![Four nets](assets/steps/03-nets.png)

---

## tiny_inv
![tiny_inv](assets/steps/04-cell.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab
- Open **real-read-spice**

---

## Implement track
- Run real_solvers.py , REAL_NETGEN_OK

---

## Pitfalls
- Editing goldens without re-running scripts

---

## Try these
- From the common folder, run the real Netgen self-test

---

## Try these — try these

```
cd courses/learn_netgen/common
python3 real_solvers.py
```

---

## Pseudocode
- Here is the check in plain steps

---

## Pseudocode — try these

```
sch_devices=2; lay_devices=2; nets=4.
ok if goldens match
```

---

## Next
- Complete the quiz for this part
- Continue Part B evidence track

