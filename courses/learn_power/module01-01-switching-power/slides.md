---
marp: true
title: Why switching
paginate: true
---

# Why switching

Dynamic power scales with activity, cap, voltage squared, and frequency

---

## The idea
- GOLDEN: psw_n1=1.0

---

## Psw formula
![Psw formula](assets/steps/01-formula.png)

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
- Call switching_power(); assert by_net['n1']==1.0

---

## Pitfalls
- Forgetting V²
- Using leakage instead of switching

---

## Your turn
- Next: leakage power

