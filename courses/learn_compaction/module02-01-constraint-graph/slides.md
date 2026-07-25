---
marp: true
title: Constraints
paginate: true
---

# Constraints

Compaction models geometry as a directed constraint graph

---

## The idea
- Nodes L_A,R_A,…; size edges R≥L+width; spacing edges L_right ≥ R_left + gap
- GOLDEN ~10 X edges

---

## Nodes
![Nodes](assets/steps/01-nodes.png)

---

## Size
![Size](assets/steps/02-size.png)

---

## Spacing
![Spacing](assets/steps/03-space.png)

---

## Source
![Source](assets/steps/04-src.png)

---

## Count
![Count](assets/steps/05-count.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call build_constraint_graph(DATA,'x'); print len(edges)

---

## Pitfalls
- Forgetting size edges
- Mixing X and Y nodes

---

## Your turn
- Next: longest-path placement

