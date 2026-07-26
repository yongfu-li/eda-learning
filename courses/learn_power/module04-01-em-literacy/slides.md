---
marp: true
title: Why EM
paginate: true
---

# Why EM

Electromigration limits peak current per grid edge

---

## The idea
- GOLDEN: em_violation_count=3

---

## Current limit
![Current limit](assets/steps/01-limit.png)

---

## Grid current
![Grid current](assets/steps/02-i.png)

---

## Edge e1
![Edge e1](assets/steps/03-e1.png)

---

## Edges e2 e3
![Edges e2 e3](assets/steps/04-e23.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call find_em_violations(); assert count==3

---

## Pitfalls
- Checking IR instead of per-edge I
- Wrong limit units

---

## Your turn
- Next: power markers

