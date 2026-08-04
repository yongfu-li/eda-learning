---
marp: true
title: Engine
paginate: true
---

# Engine

A tiny engine chains every LVS stage and reports ok when goldens match

---

## The idea
- GOLDEN: ok=True

---

## Sch
![Sch](assets/steps/01-sch.png)

---

## Recog
![Recog](assets/steps/02-recog.png)

---

## Extract
![Extract](assets/steps/03-extract.png)

---

## Compare
![Compare](assets/steps/04-compare.png)

---

## OK
![OK](assets/steps/05-ok.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call lvs_engine(); assert ok is True

---

## Pitfalls
- Reporting partial stages
- Changing toy without updating goldens

---

## Your turn
- Next: offline compare, then wrap

