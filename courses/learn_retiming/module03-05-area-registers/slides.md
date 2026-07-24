---
marp: true
title: Area/regs
paginate: true
---

# Area/regs

Retiming trades register area for shorter clock period , same function, different register placement

---

## The idea
- Forward on a

---

## Registers ≈ area
![Registers ≈ area](assets/steps/01-proxy.png)

---

## Baseline 2
![Baseline 2](assets/steps/02-base.png)

---

## Timing vs area
![Timing vs area](assets/steps/03-trade.png)

---

## Where they sit
![Where they sit](assets/steps/04-edges.png)

---

## Done
![Done](assets/steps/05-done.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Print register_count at r=0 and after forward on a (2 vs 3)

---

## Pitfalls
- Assuming retiming always reduces registers
- Ignoring period when counting area

---

## Your turn
- Next: offline benchmark, then wrap

