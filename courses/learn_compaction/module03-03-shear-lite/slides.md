---
marp: true
title: Shear
paginate: true
---

# Shear

Shear slides a channel to open or close space without full recompaction

---

## The idea
- Shear_channel_lite(x_lo,x_hi,delta_y) moves objects intersecting the band

---

## Channel
![Channel](assets/steps/01-ch.png)

---

## Delta
![Delta](assets/steps/02-dy.png)

---

## Moved
![Moved](assets/steps/03-moved.png)

---

## Legal check
![Legal check](assets/steps/04-legal.png)

---

## Use
![Use](assets/steps/05-use.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call shear_channel_lite(DATA, 7, 13, 1); print moved

---

## Pitfalls
- Shearing the whole chip blindly
- Skipping legality after shear

---

## Your turn
- Next: sequential compact pipeline

