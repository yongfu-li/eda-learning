---
marp: true
title: Clock sinks from placement
paginate: true
---

# Clock sinks from placement

Every CTS algorithm starts from sinks, cell centers that must receive the clock, and one source

---

## The idea
- Sink_points reads placement for A through F
- Source sits at six comma four
- Moving a sink moves its access point for the next tree build

---

## 12×8 chip
![12×8 chip](assets/steps/01-chip.png)

---

## Clock source
![Clock source](assets/steps/02-src.png)

---

## Sink A
![Sink A](assets/steps/03-a.png)

---

## Sink D
![Sink D](assets/steps/04-d.png)

---

## All six
![All six](assets/steps/05-all.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call `sink_points(placement, sinks)` in `common/ctsutil.py`
- Print A through F on tiny_cts
- Assert source at (6,4)

---

## Pitfalls
- Using GCell indices instead of cell centers
- Forgetting the source is fixed
- Treating nets as sinks

---

## Your turn
- Next: measure latency and skew on a built tree

