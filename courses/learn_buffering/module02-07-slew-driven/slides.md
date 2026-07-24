---
marp: true
title: Slew-driven
paginate: true
---

# Slew-driven

When DP is heavy, a slew check plus mid-edge buffer is a fast practical heuristic

---

## The idea
- For each edge compute slew; if above limit, insert BUF_X1 at the midpoint
- Lowering the limit forces more insertions

---

## Check slew
![Check slew](assets/steps/01-check.png)

---

## Tight limit
![Tight limit](assets/steps/02-tight.png)

---

## Mid buffer
![Mid buffer](assets/steps/03-mid.png)

---

## Count
![Count](assets/steps/04-count.png)

---

## vs VG
![vs VG](assets/steps/05-vs.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call `slew_driven_insert` with slew_limit=1; assert count ≥ 1

---

## Pitfalls
- Inserting without measuring slew
- Stacking infinite buffers
- Ignoring branch load

---

## Your turn
- Next: polarity and inverters

