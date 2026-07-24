---
marp: true
title: Library
paginate: true
---

# Library

Stronger buffers cost input cap but drive with lower resistance

---

## The idea
- BUF_X1, BUF_X2, INV_X1 each publish cin, rout, delay, invert
- Van Ginneken tries each non-inverting cell unless polarity mode allows INV

---

## Three cells
![Three cells](assets/steps/01-three.png)

---

## BUF_X2 stronger
![BUF_X2 stronger](assets/steps/02-x2.png)

---

## Inverter
![Inverter](assets/steps/03-inv.png)

---

## Pick for DP
![Pick for DP](assets/steps/04-pick.png)

---

## Area trade
![Area trade](assets/steps/05-area.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Print `data['buffer_library']`
- Assert GOLDENS.libCount == 3

---

## Pitfalls
- Ignoring invert flag
- Treating rout as delay
- Using cells not in the library

---

## Your turn
- Next: Van Ginneken dynamic programming lite

