---
marp: true
title: Zero-skew merge
paginate: true
---

# Zero-skew merge

Deferred-merge embedding equalizes delay so opposite arms arrive together

---

## The idea
- Partition sinks left and right of the source
- Choose a meeting steiner so left radius plus wire matches right radius plus wire
- That is the zero-skew intuition

---

## DME lite
![DME lite](assets/steps/01-idea.png)

---

## Balanced meet
![Balanced meet](assets/steps/02-demo.png)

---

## Symmetric paths
![Symmetric paths](assets/steps/03-path.png)

---

## Read skew
![Read skew](assets/steps/04-skew.png)

---

## Toy only
![Toy only](assets/steps/05-limit.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call `zero_skew_merge(a,b,da,db)` for a 1D pair; run the browser demo for the full chip
- Assert |la−lb| ≈ 0 for equal da,db

---

## Pitfalls
- Balancing Euclidean radii
- Ignoring existing subtree delay da/db
- Expecting full industrial DME from this toy

---

## Your turn
- Next: tapping points where the tree forks

