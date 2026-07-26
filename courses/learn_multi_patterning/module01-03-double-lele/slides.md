---
marp: true
title: LELE overview
paginate: true
---

# LELE overview

LELE double patterning assigns two lithography masks by 2-coloring conflicts

---

## The idea
- GOLDEN: lele_double ok=False on the full graph (triangle A-B-C)

---

## LELE idea
![LELE idea](assets/steps/01-idea.png)

---

## Two masks
![Two masks](assets/steps/02-two.png)

---

## Color attempt
![Color attempt](assets/steps/03-try.png)

---

## Odd cycle
![Odd cycle](assets/steps/04-odd.png)

---

## Fail
![Fail](assets/steps/05-fail.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call lele_double(); assert ok is False

---

## Pitfalls
- Assuming DP always works
- Ignoring odd cycles in the full layout

---

## Your turn
- Next: bipartite check on a subgraph

