---
marp: true
title: MP engine
paginate: true
---

# MP engine

A tiny MP engine picks the minimum mask count that succeeds on the layout

---

## The idea
- GOLDEN: best_masks=3, dp_ok=False, tp_ok=True

---

## Try DP
![Try DP](assets/steps/01-dp.png)

---

## Fail
![Fail](assets/steps/02-fail.png)

---

## Try TP
![Try TP](assets/steps/03-tp.png)

---

## Best 3
![Best 3](assets/steps/04-best.png)

---

## Report
![Report](assets/steps/05-rep.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call mp_engine(); assert best_masks==3 and dp_ok is False and tp_ok is True

---

## Pitfalls
- Stopping after DP failure
- Reporting QP when TP already succeeds

---

## Your turn
- Next: offline benchmark compare, then wrap

