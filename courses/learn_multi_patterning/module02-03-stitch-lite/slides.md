---
marp: true
title: Stitch overview
paginate: true
---

# Stitch overview

Stitching splits a feature so conflicts drop , restoring DP feasibility without extra masks

---

## The idea
- GOLDEN: stitch_makes_dp True after splitting C → C1, C2

---

## Odd cycle
![Odd cycle](assets/steps/01-odd.png)

---

## Split C
![Split C](assets/steps/02-split.png)

---

## New edges
![New edges](assets/steps/03-new.png)

---

## Re-color
![Re-color](assets/steps/04-re.png)

---

## DP OK
![DP OK](assets/steps/05-ok.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call stitch_feature('C'); assert dp_ok is True

---

## Pitfalls
- Splitting without reducing conflicts
- Assuming stitch always needs TP

---

## Your turn
- Next: triple patterning with 3 colors

