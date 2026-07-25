---
marp: true
title: Longest path
paginate: true
---

# Longest path

Classic 1-D compaction sets each variable to the longest path from the source

---

## The idea
- Relax edges until positions stabilize; left edges pull rightward to minimum legal places

---

## Source
![Source](assets/steps/01-src.png)

---

## Relax
![Relax](assets/steps/02-relax.png)

---

## Stable
![Stable](assets/steps/03-stable.png)

---

## Left pack
![Left pack](assets/steps/04-pack.png)

---

## Ready
![Ready](assets/steps/05-ready.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call longest_path_compact(build_constraint_graph(...))

---

## Pitfalls
- Using shortest-path instead
- Not iterating to fixpoint

---

## Your turn
- Next: apply 1-D compaction

