---
marp: true
title: Skew bound with buffers
paginate: true
---

# Skew bound with buffers

Signoff asks: is skew under budget?

---

## The idea
- Skew_bound_ok is true when skew ≤ bound
- Zero-skew merge often meets bound two on the toy

---

## Target bound
![Target bound](assets/steps/01-bound.png)

---

## Zero-skew helps
![Zero-skew helps](assets/steps/02-zs.png)

---

## H may miss
![H may miss](assets/steps/03-fail.png)

---

## Buffers + bound
![Buffers + bound](assets/steps/04-buf.png)

---

## Toward signoff
![Toward signoff](assets/steps/05-signoff.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call `skew_bound_ok(latencies, bound)`
- Document GOLDENS.skewBoundDefault = 2

---

## Pitfalls
- Hard-coding pass without measuring
- Forgetting to rebuild after moving sinks
- Mixing buffered and unbuffered latencies

---

## Your turn
- Next: sequential CTS connecting sinks in order

