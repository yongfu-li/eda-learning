---
marp: true
title: Edge pair
paginate: true
---

# Edge pair

Spacing patterns compare facing edges of same-layer shapes with overlapping projections

---

## The idea
- On M1, A–B gap is 1 but min_space=2 → one space marker
- GOLDEN space_markers=1

---

## Neighbors
![Neighbors](assets/steps/01-nb.png)

---

## Gap
![Gap](assets/steps/02-gap.png)

---

## Limit
![Limit](assets/steps/03-limit.png)

---

## Marker
![Marker](assets/steps/04-mark.png)

---

## Count
![Count](assets/steps/05-count.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call match_space(layer='M1'); assert len==1 and shapes {A,B}

---

## Pitfalls
- Matching without projection overlap
- Checking different layers as one pair

---

## Your turn
- Next: single-layer region / enclosure

