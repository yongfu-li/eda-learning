---
marp: true
title: Why signoff corner
paginate: true
---

# Why signoff corner

The slow-slow hot corner is the pessimistic signoff PVT for delay

---

## The idea
- GOLDEN: signoff_corner=ss_0p9_125, derate=1.1

---

## Pick corner
![Pick corner](assets/steps/01-pick.png)

---

## Vdd 0.9
![Vdd 0.9](assets/steps/02-vdd.png)

---

## Temp 125
![Temp 125](assets/steps/03-temp.png)

---

## Derate 1.1
![Derate 1.1](assets/steps/04-derate.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call pick_signoff_corner(); assert id and derate match goldens

---

## Pitfalls
- Using tt for signoff
- Ignoring derate on ss

---

## Your turn
- Next: apply derate

