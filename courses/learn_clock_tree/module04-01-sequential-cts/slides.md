---
marp: true
title: Sequential CTS pass
paginate: true
---

# Sequential CTS pass

Some flows grow the clock net in sink order, order changes skew

---

## The idea
- Start from the source
- For each sink in order A…F, attach an L-route to the nearest existing tree node
- Optional buffering splits long legs afterward

---

## Net order
![Net order](assets/steps/01-order.png)

---

## Built pass
![Built pass](assets/steps/02-build.png)

---

## Late sink
![Late sink](assets/steps/03-path.png)

---

## Optional buffers
![Optional buffers](assets/steps/04-buf.png)

---

## Handoff
![Handoff](assets/steps/05-done.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call `sequential_cts(data
- Print skew

---

## Pitfalls
- Assuming order does not matter
- Attaching to sinks only, not steiners
- Skipping the source as the first node

---

## Your turn
- Next: offline benchmark compare, then wrap

