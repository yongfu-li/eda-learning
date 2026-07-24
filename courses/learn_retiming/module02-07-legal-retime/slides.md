---
marp: true
title: Legal
paginate: true
---

# Legal

A retiming lag assignment r is legal only if every edge keeps a non-negative register count

---

## The idea
- Check w_r = w + r(dst) − r(src) for e0…e4; one negative edge breaks legality

---

## All w_r ≥ 0
![All w_r ≥ 0](assets/steps/01-rule.png)

---

## Zero is legal
![Zero is legal](assets/steps/02-zero.png)

---

## Forward a legal
![Forward a legal](assets/steps/03-fwd.png)

---

## Backward c illegal
![Backward c illegal](assets/steps/04-bwd.png)

---

## Always check
![Always check](assets/steps/05-check.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Test is_legal after forward on a (True) and backward on c (False)

---

## Pitfalls
- Checking only one edge
- Allowing fractional or negative w in the UI

---

## Your turn
- Next: period bound / FEAS lite

