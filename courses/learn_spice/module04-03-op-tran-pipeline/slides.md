---
marp: true
title: Why pipeline
paginate: true
---

# Why pipeline

Production SPICE runs OP first, initializes storage elements, then steps TRAN

---

## The idea
- GOLDEN: OP V2=3.0; TRAN from v2_init=0 → final_v2≈2.255181

---

## OP
![OP](assets/steps/01-op.png)

---

## Init C
![Init C](assets/steps/02-init.png)

---

## Step loop
![Step loop](assets/steps/03-loop.png)

---

## Pipeline
![Pipeline](assets/steps/04-pipe.png)

---

## Report
![Report](assets/steps/05-rep.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call dc_linear_solve() then transient_be(v2_init=0.0); report both v2 values

---

## Pitfalls
- Starting TRAN from OP cap voltage when lab sets v2_init=0
- Skipping OP check

---

## Your turn
- Next: full spice_engine integration

