---
marp: true
title: Capacitance
paginate: true
---

# Capacitance

Capacitance extract uses c_area*area + c_perim*perimeter on metals; skip VIA

---

## The idea
- GOLDEN: C_total=1.376; 3 caps

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

## s3
![s3](assets/steps/04-s3.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call extract_capacitance(); assert c_total==1.376 and count==3

---

## Pitfalls
- Adding VIA capacitance
- Using length instead of area for C

---

## Your turn
- Next: RC network build

