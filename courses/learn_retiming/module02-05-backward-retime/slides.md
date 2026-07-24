---
marp: true
title: Backward
paginate: true
---

# Backward

Backward retiming pushes registers toward inputs , increase r(v) on the chosen node

---

## The idea
- Backward_retime('c', r, 1) sets r(c)=+1; e3 w_r = 0+0−1 = −1 violates w_r ≥ 0

---

## Backward +r
![Backward +r](assets/steps/01-def.png)

---

## Pick c
![Pick c](assets/steps/02-pick.png)

---

## Apply +1
![Apply +1](assets/steps/03-apply.png)

---

## Illegal edge
![Illegal edge](assets/steps/04-illegal.png)

---

## Not every move
![Not every move](assets/steps/05-lesson.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call backward_retime('c', r, 1); assert not is_legal(edges, r)

---

## Pitfalls
- Assuming backward is always safe
- Ignoring PO-adjacent edges

---

## Your turn
- Next: legal retiming check for all edges

