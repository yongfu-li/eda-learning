---
marp: true
title: Boolean
paginate: true
---

# Boolean

Boolean patterns combine coverage predicates across layers (AND / OR / AND-NOT)

---

## The idea
- V covered by M1 and not by M2 → and_not hit
- GOLDEN boolean_and_hits=1

---

## Cover M1
![Cover M1](assets/steps/01-m1.png)

---

## Cover M2
![Cover M2](assets/steps/02-m2.png)

---

## And-not
![And-not](assets/steps/03-andnot.png)

---

## And
![And](assets/steps/04-and.png)

---

## Hit
![Hit](assets/steps/05-hit.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call layered_boolean('and_not'); assert one hit on V

---

## Pitfalls
- Confusing overlap with containment
- Swapping AND and AND-NOT

---

## Your turn
- Next: full match engine pass

