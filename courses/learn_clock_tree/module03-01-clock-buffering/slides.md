---
marp: true
title: Clock buffering on wires
paginate: true
---

# Clock buffering on wires

Long wires lose slew; CTS inserts buffers along the tree

---

## The idea
- If an edge longer than maxWireLen
- Buffered latency adds bufferDelay per buffer on the path

---

## Long wires
![Long wires](assets/steps/01-idea.png)

---

## Before buffers
![Before buffers](assets/steps/02-before.png)

---

## After insert
![After insert](assets/steps/03-after.png)

---

## Buffered latency
![Buffered latency](assets/steps/04-latency.png)

---

## Trade-off
![Trade-off](assets/steps/05-trade.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call `insert_buffers(edge, max_span, buffer_delay)`
- Assert max segment length ≤ max_span

---

## Pitfalls
- Buffering without splitting edges
- Counting buffer delay twice
- Using max span zero

---

## Your turn
- Next: meet a skew bound with buffers and topology choice

