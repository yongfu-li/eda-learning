---
marp: true
title: Quad patterning
paginate: true
---

# Quad patterning

Quad patterning reserves four masks; greedy coloring shows headroom when fewer suffice

---

## The idea
- GOLDEN: colors_used=3, k=4, ok=True on tiny_mp

---

## Four masks
![Four masks](assets/steps/01-four.png)

---

## Greedy
![Greedy](assets/steps/02-gr.png)

---

## Used 3
![Used 3](assets/steps/03-u3.png)

---

## Headroom
![Headroom](assets/steps/04-head.png)

---

## OK
![OK](assets/steps/05-ok.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call quad_pattern(method='greedy'); assert ok and colors_used==3

---

## Pitfalls
- Requiring all four masks used
- Confusing QP with TP

---

## Your turn
- Next: multi-patterning engine pass

