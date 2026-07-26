---
marp: true
title: Engine
paginate: true
---

# Engine

A tiny engine chains corners, checks, ECO, tapeout, and markers

---

## The idea
- GOLDEN: corners=3, fails=2, ecos=2, markers=2, ok=True

---

## Design stats
![Design stats](assets/steps/01-stats.png)

---

## Corner pick
![Corner pick](assets/steps/02-corner.png)

---

## Check fails
![Check fails](assets/steps/03-checks.png)

---

## ECO + tapeout
![ECO + tapeout](assets/steps/04-eco.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call signoff_engine(); assert ok and markers.count==2

---

## Pitfalls
- Reporting partial checks
- Changing toy without updating goldens

---

## Your turn
- Next: offline compare, then wrap

