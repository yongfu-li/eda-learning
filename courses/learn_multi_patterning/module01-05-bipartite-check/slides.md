---
marp: true
title: DP feasibility
paginate: true
---

# DP feasibility

A subgraph that is bipartite can still be double-patterned even when the full chip is not

---

## The idea
- GOLDEN: path_lele ok=True on nodes D, E, F

---

## Subgraph
![Subgraph](assets/steps/01-sub.png)

---

## BFS color
![BFS color](assets/steps/02-bfs.png)

---

## Path DEF
![Path DEF](assets/steps/03-def.png)

---

## Colors 0/1
![Colors 0/1](assets/steps/04-cols.png)

---

## OK
![OK](assets/steps/05-ok.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call path_lele(); assert ok is True

---

## Pitfalls
- Testing full graph when the lesson is subgraph feasibility
- Confusing LELE with SADP

---

## Your turn
- Next: SADP mandrel assignment

