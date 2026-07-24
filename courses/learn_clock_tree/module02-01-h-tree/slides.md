---
marp: true
title: H-tree topology
paginate: true
---

# H-tree topology

H-trees are the classic picture of a balanced clock network on a regular array

---

## The idea
- From the source, alternate horizontal and vertical splits toward sink groups
- Each split creates steiner points and L-shaped legs to children

---

## Recursive H
![Recursive H](assets/steps/01-idea.png)

---

## Built tree
![Built tree](assets/steps/02-build.png)

---

## Path highlight
![Path highlight](assets/steps/03-path.png)

---

## Balance goal
![Balance goal](assets/steps/04-balance.png)

---

## When H-tree
![When H-tree](assets/steps/05-use.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call `h_tree(source, chip)` / browser `hTree(positions)`
- Attach sinks and print edge count and skew

---

## Pitfalls
- Stopping after one H without recursion
- Connecting sinks with Euclidean edges
- Ignoring steiner points when measuring latency

---

## Your turn
- Next: Method of Means and Medians for irregular sinks

