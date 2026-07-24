---
marp: true
title: Seq graph
paginate: true
---

# Seq graph

Retiming starts from a sequential circuit graph , not just a Boolean network

---

## The idea
- Nodes carry combinational delay; edges carry register counts w
- Our toy has five nodes and five edges

---

## Topology
![Topology](assets/steps/01-topo.png)

---

## PI/PO
![PI/PO](assets/steps/02-pi.png)

---

## Comb boxes
![Comb boxes](assets/steps/03-comb.png)

---

## Five edges
![Five edges](assets/steps/04-edges.png)

---

## Stats
![Stats](assets/steps/05-stats.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Load tiny_retime.json; call graph_stats , expect 5 nodes, 5 edges

---

## Pitfalls
- Treating edge w as delay
- Confusing PO v with a comb node

---

## Your turn
- Next: edge register counts in detail

