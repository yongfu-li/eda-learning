---
marp: true
title: Why order
paginate: true
---

# Why order

Scan order must include every flop exactly once

---

## The idea
- GOLDEN: order f1→f2→f3→f4; covers_all=true

---

## Order list
![Order list](assets/steps/01-list.png)

---

## First f1
![First f1](assets/steps/02-f1.png)

---

## Middle f2 f3
![Middle f2 f3](assets/steps/03-mid.png)

---

## Tail f4
![Tail f4](assets/steps/04-tail.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call scan_order_check(); assert length==4 and covers_all

---

## Pitfalls
- Duplicate flop in order
- Missing f4

---

## Your turn
- Next: lockup latch

