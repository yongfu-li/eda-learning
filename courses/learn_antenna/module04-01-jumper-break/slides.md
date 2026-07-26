---
marp: true
title: Why jumper
paginate: true
---

# Why jumper

A jumper on lower metal breaks antenna path , drops high-layer metal

---

## The idea
- GOLDEN: jumper on n1 max_layer=1 → ratio 0

---

## Add jumper
![Add jumper](assets/steps/01-jumper.png)

---

## Before
![Before](assets/steps/02-before.png)

---

## Cap L1
![Cap L1](assets/steps/03-cap.png)

---

## After
![After](assets/steps/04-after.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call jumper_effect(); assert after_ratio==0

---

## Pitfalls
- Not filtering by layer
- Applying jumper to wrong net

---

## Your turn
- Next: antenna markers

