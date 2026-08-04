---
marp: true
title: Engine
paginate: true
---

# Engine

A tiny engine chains every PEX stage and reports ok when goldens match

---

## The idea
- GOLDEN: ok=True

---

## Geo
![Geo](assets/steps/01-geo.png)

---

## R/C
![R/C](assets/steps/02-rc.png)

---

## Reduce
![Reduce](assets/steps/03-reduce.png)

---

## SPEF
![SPEF](assets/steps/04-spef.png)

---

## OK
![OK](assets/steps/05-ok.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call pex_engine(); assert ok is True

---

## Pitfalls
- Reporting partial stages
- Changing toy without updating goldens

---

## Your turn
- Next: offline compare, then wrap

