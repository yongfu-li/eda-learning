---
marp: true
title: Why transform
paginate: true
---

# Why transform

DFT insert adds scan wiring edges to the netlist

---

## The idea
- GOLDEN: transform_edge_count=6 (SI + 3 stitches + SO + 1 lockup)

---

## SI edge
![SI edge](assets/steps/01-si.png)

---

## Stitch edges
![Stitch edges](assets/steps/02-st.png)

---

## SO edge
![SO edge](assets/steps/03-so.png)

---

## Lockup edge
![Lockup edge](assets/steps/04-lk.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call netlist_transform(); assert edge_count==6

---

## Pitfalls
- Double-counting stitches
- Forgetting lockup edge

---

## Your turn
- Next: DFT markers

