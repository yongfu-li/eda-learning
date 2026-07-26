---
marp: true
title: Why engine
paginate: true
---

# Why engine

A tiny engine chains every ERC check and reports ok when goldens match

---

## The idea
- GOLDEN: floating=1, undriven=1, multi=1, short=1, well=1, markers=5, ok=True

---

## Stats
![Stats](assets/steps/01-stats.png)

---

## Float+undrv
![Float+undrv](assets/steps/02-fu.png)

---

## Multi+short
![Multi+short](assets/steps/03-ms.png)

---

## Well
![Well](assets/steps/04-well.png)

---

## OK
![OK](assets/steps/05-ok.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call erc_engine(); assert ok and markers.count==5

---

## Pitfalls
- Reporting partial checks
- Changing the toy without updating goldens

---

## Your turn
- Next: offline compare, then wrap

