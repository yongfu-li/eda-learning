---
marp: true
title: Period bound
paginate: true
---

# Period bound

Given target period φ, a retiming is feasible if it is legal and the clock period is at most φ

---

## The idea
- Feas_check(data, 5, r) after forward on a: period 5 ≤ target 5 , passes

---

## FEAS lite
![FEAS lite](assets/steps/01-feas.png)

---

## Target 5
![Target 5](assets/steps/02-target.png)

---

## Baseline fails
![Baseline fails](assets/steps/03-base-fail.png)

---

## Forward passes
![Forward passes](assets/steps/04-fwd-pass.png)

---

## Full WD later
![Full WD later](assets/steps/05-wd.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call feas_check(DATA, 5, r) with forward-on-a r; expect True

---

## Pitfalls
- Forgetting legality in FEAS
- Comparing to target 8 instead of 5

---

## Your turn
- Next: min-period search across candidate retimings

