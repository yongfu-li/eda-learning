---
marp: true
title: Why graph
paginate: true
---

# Why graph

ERC starts from a connectivity graph , instances, nets, and pin edges

---

## The idea
- GOLDEN: 8 nets, 4 instances, 14 pin edges

---

## Nets
![Nets](assets/steps/01-nets.png)

---

## Instances
![Instances](assets/steps/02-inst.png)

---

## Edges
![Edges](assets/steps/03-edges.png)

---

## Walk
![Walk](assets/steps/04-walk.png)

---

## Count
![Count](assets/steps/05-count.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call design_stats() and build_connectivity(); assert net_count==8, edge_count==14

---

## Pitfalls
- Counting wells as instances
- Double-counting supply pins

---

## Your turn
- Next: classify drivers vs loads

