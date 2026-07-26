---
marp: true
title: Why ratio
paginate: true
---

# Why ratio

Foundry antenna rules compare metal exposure to gate area

---

## The idea
- GOLDEN: n1=25, n2=4, n3=45

---

## Ratio formula
![Ratio](assets/steps/01-formula.png)

---

## n1
![n1](assets/steps/02-n1r.png)

---

## n2
![n2](assets/steps/03-n2r.png)

---

## n3
![n3](assets/steps/04-n3r.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call antenna_ratios(); assert ratios['n1']==25, ratios['n2']==4, ratios['n3']==45

---

## Pitfalls
- Dividing gate/metal
- Forgetting multi-layer metal sum

---

## Your turn
- Next: charge accumulation

