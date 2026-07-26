---
marp: true
title: Engine
paginate: true
---

# Engine

A tiny engine chains scan cells, stitch, lockup, transform, and markers

---

## The idea
- GOLDEN: scan cells=4, stitches=3, lockups=1, edges=6, markers=1, ok=True

---

## Stats snapshot
![Stats snapshot](assets/steps/01-stats.png)

---

## Scan cells
![Scan cells](assets/steps/02-cells.png)

---

## Chain check
![Chain check](assets/steps/03-chain.png)

---

## Lockup check
![Lockup check](assets/steps/04-lockup.png)

---

## Engine OK
![Engine OK](assets/steps/05-ok.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call dft_engine(); assert ok and markers.count==1

---

## Pitfalls
- Reporting partial checks
- Changing toy without updating goldens

---

## Your turn
- Next: offline compare, then wrap

