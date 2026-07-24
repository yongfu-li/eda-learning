---
marp: true
title: Polarity
paginate: true
---

# Polarity

Inverters are useful buffers but flip the signal; odd counts need a fix

---

## The idea
- Each INV_X1 flips polarity
- Polarity_fix reports flips and whether the path is still positive

---

## Invert flag
![Invert flag](assets/steps/01-flag.png)

---

## One flip
![One flip](assets/steps/02-one.png)

---

## Two flips
![Two flips](assets/steps/03-two.png)

---

## Mix with BUF
![Mix with BUF](assets/steps/04-mix.png)

---

## Design rule
![Design rule](assets/steps/05-rule.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call `polarity_fix([INV],[BUF])`
- Assert flips and positive flags

---

## Pitfalls
- Counting BUF as invert
- Forgetting parity
- Using INV in VG when allow_invert is false

---

## Your turn
- Next: fanout buffering at the junction

