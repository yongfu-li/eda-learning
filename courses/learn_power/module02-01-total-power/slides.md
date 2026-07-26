---
marp: true
title: Why total
paginate: true
---

# Why total

Signoff reports chip Ptot = sum of switching and leakage

---

## The idea
- GOLDEN: chip_ptot=5.55

---

## Chip Ptot
![Chip Ptot](assets/steps/01-sum.png)

---

## Net n1
![Net n1](assets/steps/02-n1.png)

---

## Chip Psw
![Chip Psw](assets/steps/03-chip_sw.png)

---

## Chip Pleak
![Chip Pleak](assets/steps/04-chip_lk.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call total_power(); assert total==5.55

---

## Pitfalls
- Summing only one component
- Double-counting nets

---

## Your turn
- Next: activity factors

