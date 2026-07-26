---
marp: true
title: Why IR drop
paginate: true
---

# Why IR drop

Same sink current on every edge; accumulate I·R drops

---

## The idea
- GOLDEN: ir_drop_sink=0.4, v_sink=0.6

---

## IR solve
![IR solve](assets/steps/01-solve.png)

---

## Current
![Current](assets/steps/02-i.png)

---

## Edge drops
![Edge drops](assets/steps/03-drops.png)

---

## Sink voltage
![Sink voltage](assets/steps/04-vsink.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call ir_drop_solve(); assert v_sink==0.6 and ir_drop_sink==0.4

---

## Pitfalls
- Using parallel formula
- Wrong edge order

---

## Your turn
- Next: EM literacy

