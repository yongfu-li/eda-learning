---
marp: true
title: Fanout
paginate: true
---

# Fanout

One driver cannot feed too many sinks without a buffer tree stage

---

## The idea
- If sink count exceeds max_fanout (two on the toy), insert BUF_X2 at S0
- Three sinks therefore force an insert

---

## Fanout three
![Fanout three](assets/steps/01-fo.png)

---

## Max two
![Max two](assets/steps/02-max.png)

---

## At S0
![At S0](assets/steps/03-s0.png)

---

## BUF_X2
![BUF_X2](assets/steps/04-x2.png)

---

## Compose
![Compose](assets/steps/05-compose.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call `fanout_buffer_tree(data, max_fanout=2)`
- Assert inserted is true

---

## Pitfalls
- Buffering at the driver only
- Using max_fanout ≥ sink count
- Forgetting S0 coordinates

---

## Your turn
- Next: full sequential buffering pass

