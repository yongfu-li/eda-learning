---
marp: true
title: Engine
paginate: true
---

# Engine

A tiny engine chains power, IR, EM, and markers

---

## The idea
- GOLDEN: chip Ptot=5.55, ir_drop=0.4, markers=4, ok=True

---

## Stats snapshot
![Stats snapshot](assets/steps/01-stats.png)

---

## Power totals
![Power totals](assets/steps/02-power.png)

---

## IR check
![IR check](assets/steps/03-ir.png)

---

## EM check
![EM check](assets/steps/04-em.png)

---

## Engine OK
![Engine OK](assets/steps/05-ok.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call power_engine(); assert ok and markers.count==4

---

## Pitfalls
- Reporting partial checks
- Changing toy without updating goldens

---

## Your turn
- Next: offline compare, then wrap

