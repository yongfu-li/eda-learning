---
marp: true
title: Why derate
paginate: true
---

# Why derate

Reported path delay scales by the signoff corner derate

---

## The idea
- GOLDEN: derated=1.1 for delay=1.0

---

## Delay scale
![Delay scale](assets/steps/01-formula.png)

---

## Input 1.0
![Input 1.0](assets/steps/02-in.png)

---

## Derate 1.1
![Derate 1.1](assets/steps/03-rate.png)

---

## Result 1.1
![Result 1.1](assets/steps/04-out.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call apply_derate(1.0); assert derated==1.1

---

## Pitfalls
- Using wrong corner derate
- Forgetting multiply order

---

## Your turn
- Next: check suite

