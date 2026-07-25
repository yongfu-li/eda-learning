---
marp: true
title: Spacing
paginate: true
---

# Spacing

Design rules demand a minimum gap between adjacent shapes that project on an axis

---

## The idea
- Min_gap=1 on the toy
- Initial layout is legal; illegal if two cells overlap or gap < 1

---

## Gap one
![Gap one](assets/steps/01-gap.png)

---

## Legal init
![Legal init](assets/steps/02-legal.png)

---

## Overlap fail
![Overlap fail](assets/steps/03-overlap.png)

---

## Project
![Project](assets/steps/04-proj.png)

---

## Why
![Why](assets/steps/05-why.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call is_legal(DATA); assert True
- Print min_gap

---

## Pitfalls
- Applying gap without projection overlap
- Ignoring wires wrongly as cells

---

## Your turn
- Next: the constraint graph

