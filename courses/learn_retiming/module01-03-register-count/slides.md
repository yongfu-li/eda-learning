---
marp: true
title: Registers
paginate: true
---

# Registers

In Leiserson–Saxe form, each edge weight w is how many registers sit on that wire

---

## The idea
- E0 u→a has w=1; e2 b→c has w=1; zero-weight edges are combinational

---

## Weights
![Weights](assets/steps/01-w.png)

---

## e0 has 1
![e0 has 1](assets/steps/02-e0.png)

---

## e1 has 0
![e1 has 0](assets/steps/03-e1.png)

---

## Sum = 2
![Sum = 2](assets/steps/04-sum.png)

---

## Retiming moves w
![Retiming moves w](assets/steps/05-move.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call total_registers(edges); assert sum == 2

---

## Pitfalls
- Counting nodes instead of edges
- Forgetting w on u→a

---

## Your turn
- Next: zero-weight path delay / clock period

