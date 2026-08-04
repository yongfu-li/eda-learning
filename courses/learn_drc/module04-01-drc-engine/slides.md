---
marp: true
title: Engine
paginate: true
---

# Engine

A tiny engine chains every checker and reports ok when goldens match

---

## The idea
- GOLDEN: ok=True viol=3

---

## Deck
![Deck](assets/steps/01-deck.png)

---

## Checks
![Checks](assets/steps/02-checks.png)

---

## Viol
![Viol](assets/steps/03-viol.png)

---

## Bool
![Bool](assets/steps/04-bool.png)

---

## OK
![OK](assets/steps/05-ok.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call drc_engine(); assert ok and violations.count==3

---

## Pitfalls
- Reporting partial checks
- Changing the toy without updating goldens

---

## Your turn
- Next: offline compare, then wrap

