---
marp: true
title: Spec vs impl
paginate: true
---

# Spec vs impl

Equivalence checking always compares two circuits: a golden spec and a candidate implementation

---

## The idea
- Spec computes f=(a∧b)∨c with two gates

---

## Spec netlist
![Spec netlist](assets/steps/01-spec.png)

---

## Good rewrite
![Good rewrite](assets/steps/02-good.png)

---

## Bad rewrite
![Bad rewrite](assets/steps/03-bad.png)

---

## Eval at cex
![Eval at cex](assets/steps/04-eval.png)

---

## CEC goal
![CEC goal](assets/steps/05-goal.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Load tiny_equiv.json; call evaluate_circuit on spec and both impls for all 8 rows

---

## Pitfalls
- Swapping spec and impl
- Comparing only one input corner

---

## Your turn
- Next: build the miter (XOR of outputs)

