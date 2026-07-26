---
marp: true
title: Why stitch
paginate: true
---

# Why stitch

Chain stitch wires Q of previous flop to SI of next in scan_order

---

## The idea
- GOLDEN: stitch_count=3

---

## Stitch rule
![Stitch rule](assets/steps/01-rule.png)

---

## f1→f2
![f1→f2](assets/steps/02-s12.png)

---

## f2→f3
![f2→f3](assets/steps/03-s23.png)

---

## f3→f4
![f3→f4](assets/steps/04-s34.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call stitch_chain(); assert stitch_count==3

---

## Pitfalls
- Counting SI/SO hooks as stitches
- Wrong order

---

## Your turn
- Next: scan order check

