---
marp: true
title: Latency and skew
paginate: true
---

# Latency and skew

Skew is the CTS scoreboard: how different are arrival times at sinks

---

## The idea
- Walk the tree from source to each sink summing Manhattan edge lengths
- Skew equals max latency minus min latency
- Wire delay per unit is one on the toy

---

## Skew = max − min
![Skew = max − min](assets/steps/01-def.png)

---

## H-tree skew
![H-tree skew](assets/steps/02-h.png)

---

## MMM skew
![MMM skew](assets/steps/03-mmm.png)

---

## Path to A
![Path to A](assets/steps/04-path.png)

---

## Drive skew down
![Drive skew down](assets/steps/05-goal.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Implement or call `latency(path)` and `skew(latencies)` in `common/solvers.py`
- Print skew for MMM on tiny_cts

---

## Pitfalls
- Using Euclidean distance
- Comparing sinks without a tree
- Treating buffer delay as wire length without counting buffers

---

## Your turn
- Next: grow a classic H-tree topology

