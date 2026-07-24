---
marp: true
title: Cuts
paginate: true
---

# Cuts

Cuts describe which leaves a subgraph may stand on for techmapping

---

## The idea
- PI cut={self}
- AND cuts = unions of fanin cuts with size ≤ k, plus trivial {self}

---

## K=3
![K=3](assets/steps/01-k.png)

---

## PI cuts
![PI cuts](assets/steps/02-pi.png)

---

## Combine
![Combine](assets/steps/03-comb.png)

---

## PO cuts
![PO cuts](assets/steps/04-po.png)

---

## Stats
![Stats](assets/steps/05-stats.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call enumerate_cuts(k=3); assert all |cut|≤3

---

## Pitfalls
- Allowing cuts larger than k
- Forgetting the trivial cut

---

## Your turn
- Next: the cell library

