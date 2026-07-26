---
marp: true
title: Decomp literacy
paginate: true
---

# Decomp literacy

Production flows may use greedy heuristics or exact backtrack , know when they differ

---

## The idea
- On tiny_mp both methods succeed; colors_used=3 for greedy and backtrack

---

## Greedy
![Greedy](assets/steps/01-g.png)

---

## Backtrack
![Backtrack](assets/steps/02-b.png)

---

## Same used
![Same used](assets/steps/03-same.png)

---

## Methods
![Methods](assets/steps/04-meth.png)

---

## Choose
![Choose](assets/steps/05-ch.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Compare color_greedy(G,3) vs color_backtrack(G,3); assert both ok

---

## Pitfalls
- Assuming greedy always equals backtrack
- Ignoring failure cases on larger graphs

---

## Your turn
- Next: quad patterning with headroom

