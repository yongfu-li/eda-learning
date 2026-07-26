---
marp: true
title: Chain view
paginate: true
---

# Chain view

Browser view stitches chain, ports, and lockup for sanity check

---

## The idea
- GOLDEN: f1→f2→f3→f4; lockup between f3→f4

---

## Draw chain
![Draw chain](assets/steps/01-draw.png)

---

## Stitch lines
![Stitch lines](assets/steps/02-stitches.png)

---

## Lockup highlight
![Lockup highlight](assets/steps/03-lockup.png)

---

## SE label
![SE label](assets/steps/04-se.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Reuse stitch + lockup + transform; drawDft shows chain

---

## Pitfalls
- Drawing functional D paths instead of scan
- Hiding lockup

---

## Your turn
- Next: DFT engine

