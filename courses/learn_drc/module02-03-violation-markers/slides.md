---
marp: true
title: Violations
paginate: true
---

# Violations

Signoff DRC emits markers , one record per geometry violation with rule_id

---

## The idea
- GOLDEN: violation_count=3 with rule_id

---

## Width m
![Width m](assets/steps/01-width.png)

---

## Space m
![Space m](assets/steps/02-space.png)

---

## Enc m
![Enc m](assets/steps/03-enc.png)

---

## Rule id
![Rule id](assets/steps/04-rule.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call collect_violations(); assert count==3 and all have rule_id

---

## Pitfalls
- Double-counting boolean hits as geometry violations
- Missing rule_id field

---

## Your turn
- Next: multi-layer deck rules

