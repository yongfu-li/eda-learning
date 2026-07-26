---
marp: true
title: Why MNA
paginate: true
---

# Why MNA

Modified nodal analysis builds G and b by stamping each element into a shared matrix

---

## The idea
- GOLDEN: mna size 3 , unknowns v1, v2, branch current i_Vin

---

## Stamp R
![Stamp R](assets/steps/01-r.png)

---

## Stamp V
![Stamp V](assets/steps/02-v.png)

---

## Matrix G
![Matrix G](assets/steps/03-g.png)

---

## RHS b
![RHS b](assets/steps/04-b.png)

---

## Size 3
![Size 3](assets/steps/05-sz.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call build_mna_linear_dc(); assert size==3

---

## Pitfalls
- Forgetting voltage-source branch currents
- Stamping C or D in linear DC MNA

---

## Your turn
- Next: solve linear DC for V2=3

