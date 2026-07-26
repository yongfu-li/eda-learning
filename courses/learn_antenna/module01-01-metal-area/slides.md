---
marp: true
title: Metal area
paginate: true
---

# Metal area

Antenna checks start by summing metal area on each net

---

## The idea
- GOLDEN: metal_area n1=25

---

## Sum metal
![Sum metal](assets/steps/01-sum.png)

---

## Net n1
![Net n1](assets/steps/02-n1.png)

---

## Net n2
![Net n2](assets/steps/03-n2.png)

---

## Net n3
![Net n3](assets/steps/04-n3.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call metal_area_by_net(); assert area['n1']==25

---

## Pitfalls
- Double-counting after jumper cap
- Ignoring layer filter

---

## Your turn
- Next: gate area per net

