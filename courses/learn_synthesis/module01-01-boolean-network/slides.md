---
marp: true
title: Boolean net
paginate: true
---

# Boolean net

Synthesis starts from a technology-independent subject graph

---

## The idea
- Our subject graph is an And-Inverter Graph: AND nodes with optional complemented edges

---

## Graph
![Graph](assets/steps/01-graph.png)

---

## PIs
![PIs](assets/steps/02-pis.png)

---

## AND boxes
![AND boxes](assets/steps/03-ands.png)

---

## Bubbles
![Bubbles](assets/steps/04-comp.png)

---

## PO
![PO](assets/steps/05-po.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Load tiny_synth.json; print aig_stats

---

## Pitfalls
- Treating INV as a separate AIG node type
- Ignoring complement bubbles

---

## Your turn
- Next: AIG node types in detail

