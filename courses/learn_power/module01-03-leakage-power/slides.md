---
marp: true
title: Why leakage
paginate: true
---

# Why leakage

Static leakage current times supply voltage gives Pleak

---

## The idea
- GOLDEN: plk_n1=0.1

---

## Pleak formula
![Pleak formula](assets/steps/01-formula.png)

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
- Call leakage_power(); assert by_net['n1']==0.1

---

## Pitfalls
- Mixing Ileak with switching alpha
- Wrong voltage

---

## Your turn
- Next: total power

