---
marp: true
title: Enclosure
paginate: true
---

# Enclosure

Enclosure rules require VIA (inner) to sit inside metal (outer) by a margin

---

## The idea
- GOLDEN: enc=1 V vs M2, E.VIA_M2

---

## Rule
![Rule](assets/steps/01-rule.png)

---

## VIA
![VIA](assets/steps/02-via.png)

---

## M2
![M2](assets/steps/03-m2.png)

---

## Margin
![Margin](assets/steps/04-margin.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call check_enclosure(); assert count==1 and inner=='V'

---

## Pitfalls
- Checking M1 enclosure when M2 is the failing outer
- Using overlap instead of contains

---

## Your turn
- Next: collect violation markers

