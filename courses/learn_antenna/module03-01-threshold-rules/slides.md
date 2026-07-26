---
marp: true
title: Threshold
paginate: true
---

# Threshold

Raw violations before diode protection: any ratio above limit

---

## The idea
- GOLDEN: raw_violation_count=2 (n1, n3)

---

## Limit
![Limit](assets/steps/01-limit.png)

---

## n1 fail
![n1 fail](assets/steps/02-n1v.png)

---

## n2 ok
![n2 ok](assets/steps/03-n2ok.png)

---

## n3 fail
![n3 fail](assets/steps/04-n3v.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call find_violations(apply_diodes=False); assert count==2

---

## Pitfalls
- Applying diodes too early
- Using charge instead of ratio

---

## Your turn
- Next: diode protection

