---
marp: true
title: Why grid
paginate: true
---

# Why grid

IR analysis starts from a resistive grid and sink current

---

## The idea
- GOLDEN: 4 nodes, 3 series edges

---

## Series path
![Series path](assets/steps/01-path.png)

---

## Edge e1
![Edge e1](assets/steps/02-e1.png)

---

## Edge e2
![Edge e2](assets/steps/03-e2.png)

---

## Edge e3
![Edge e3](assets/steps/04-e3.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call build_power_grid(); assert edge_count==3

---

## Pitfalls
- Treating grid as parallel
- Wrong node order

---

## Your turn
- Next: IR drop

