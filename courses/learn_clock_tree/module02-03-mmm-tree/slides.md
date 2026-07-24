---
marp: true
title: Method of Means and Medians
paginate: true
---

# Method of Means and Medians

When sinks are irregular, greedy merge adapts better than a pure geometric H

---

## The idea
- Treat each sink as a fragment
- Repeatedly merge the closest pair of fragment roots at their midpoint

---

## Means & medians
![Means & medians](assets/steps/01-idea.png)

---

## Merged tree
![Merged tree](assets/steps/02-build.png)

---

## Merge points
![Merge points](assets/steps/03-steiners.png)

---

## vs H-tree
![vs H-tree](assets/steps/04-vs-h.png)

---

## Toward DME
![Toward DME](assets/steps/05-next.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call `mmm_tree(source, sinks)` in solvers
- Assert every sink endpoint appears in the edge set

---

## Pitfalls
- Merging by Euclidean when latency is Manhattan
- Forgetting to connect the final fragment to the source
- Dropping steiner coordinates when buffering

---

## Your turn
- Next: zero-skew merge (DME lite)

