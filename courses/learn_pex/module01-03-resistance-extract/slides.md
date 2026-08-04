---
marp: true
title: Resistance
paginate: true
---

# Resistance

Resistance extract computes R = rho*L/W for metals; VIA uses lump rho

---

## The idea
- GOLDEN: R_total=3.06; s1=0.5

---

## Formula
![Formula](assets/steps/01-formula.png)

---

## s1
![s1](assets/steps/02-s1.png)

---

## s2
![s2](assets/steps/03-s2.png)

---

## v1
![v1](assets/steps/04-v1.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call extract_resistance(); assert r_total==3.06 and resistors['s1']==0.5

---

## Pitfalls
- Using max edge as width
- Forgetting VIA lump resistance

---

## Your turn
- Next: capacitance extract

