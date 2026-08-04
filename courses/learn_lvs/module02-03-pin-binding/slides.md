---
marp: true
title: Pin binding
paginate: true
---

# Pin binding

Binding table maps layout X0→mn1 and layout nets to schematic ports

---

## The idea
- GOLDEN: X0→mn1, X1→mp1; 4 net binds

---

## Dev bind
![Dev bind](assets/steps/01-dev.png)

---

## Net bind
![Net bind](assets/steps/02-net.png)

---

## Supplies
![Supplies](assets/steps/03-sup.png)

---

## Pairs
![Pairs](assets/steps/04-pairs.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call pin_binding(); assert devices['X0']=='mn1' and len(nets)==4

---

## Pitfalls
- Binding by position instead of connectivity
- Missing a supply bind

---

## Your turn
- Next: device matching

