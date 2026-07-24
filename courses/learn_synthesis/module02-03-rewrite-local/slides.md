---
marp: true
title: Rewrite
paginate: true
---

# Rewrite

Rewriting reshapes the AIG before mapping without changing function

---

## The idea
- Count nodes with complemented edges or AND children; flag AND(~x,~y) as NOR-friendly

---

## Opportunities
![Opportunities](assets/steps/01-opp.png)

---

## Both comp
![Both comp](assets/steps/02-both.png)

---

## Push
![Push](assets/steps/03-push.png)

---

## Preserve
![Preserve](assets/steps/04-fn.png)

---

## Map later
![Map later](assets/steps/05-map.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call local_rewrite_count and apply_inverter_push

---

## Pitfalls
- Mutating function accidentally
- Counting PIs as rewrite targets

---

## Your turn
- Next: k-feasible cuts

