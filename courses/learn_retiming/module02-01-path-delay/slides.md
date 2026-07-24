---
marp: true
title: Path delay
paginate: true
---

# Path delay

Clock period is the longest delay along paths that use only w=0 edges (registers break paths)

---

## The idea
- Zero edges e1, e3, e4 form comb segments; longest chain a→b→c hits delays 3+2+4 → period 8

---

## Zero-weight paths
![Zero-weight paths](assets/steps/01-zero.png)

---

## Hot path
![Hot path](assets/steps/02-hot.png)

---

## Baseline P=8
![Baseline P=8](assets/steps/03-base.png)

---

## Target 5
![Target 5](assets/steps/04-target.png)

---

## Break with registers
![Break with registers](assets/steps/05-idea.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call clock_period(data, zero_retime(data)); assert ≈ 8

---

## Pitfalls
- Including w=1 edges in the critical path
- Summing edge delays instead of node delays

---

## Your turn
- Next: forward retiming on node a

