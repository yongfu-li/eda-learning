---
marp: true
title: Why lockup
paginate: true
---

# Why lockup

Lockup latches bridge clock domains on scan path

---

## The idea
- GOLDEN: lockup_count=1 on f3→f4 (d0→d1)

---

## Domain crossing
![Domain crossing](assets/steps/01-cross.png)

---

## f3→f4 pair
![f3→f4 pair](assets/steps/02-pair.png)

---

## Lockup cell
![Lockup cell](assets/steps/03-cell.png)

---

## Clock domains
![Clock domains](assets/steps/04-clk.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call find_lockups(); assert count==1 and from f3 to f4

---

## Pitfalls
- Lockup on same domain
- Missing clk2 crossing

---

## Your turn
- Next: netlist transform

