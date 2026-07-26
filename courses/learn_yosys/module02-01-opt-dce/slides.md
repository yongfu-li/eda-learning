---
marp: true
title: Why opt
paginate: true
---

# Why opt

Opt removes unreachable logic such as BUF tied to const0

---

## The idea
- GOLDEN: after_opt_cells=5, removed c4

---

## Dead BUF scan
![Dead BUF scan](assets/steps/01-scan.png)

---

## BUF c4
![BUF c4](assets/steps/02-buf.png)

---

## Remove c4
![Remove c4](assets/steps/03-drop.png)

---

## Five cells
![Five cells](assets/steps/04-five.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call pass_opt_dce(); assert cell_count==5 and c4 in removed

---

## Pitfalls
- Removing live cells
- Skipping opt before strash

---

## Your turn
- Next: AIG strash

