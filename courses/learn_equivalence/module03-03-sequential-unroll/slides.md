---
marp: true
title: Seq unroll
paginate: true
---

# Seq unroll

Sequential equivalence often unrolls both designs for k cycles and runs combinational CEC on the unrolled POs

---

## The idea
- Sequential_unroll(spec

---

## Flip-flop
![Flip-flop](assets/steps/01-ff.png)

---

## Unroll k
![Unroll k](assets/steps/02-steps.png)

---

## Frame PIs
![Frame PIs](assets/steps/03-pis.png)

---

## Copied gates
![Copied gates](assets/steps/04-gates.png)

---

## Why unroll
![Why unroll](assets/steps/05-why.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call sequential_unroll(DATA['sequential']['spec'], 2); inspect gates and PIs

---

## Pitfalls
- Unrolling without resetting state
- Confusing PO y with next state

---

## Your turn
- Next: sequential CEC lite

