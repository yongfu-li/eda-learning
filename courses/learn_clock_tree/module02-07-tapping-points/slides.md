---
marp: true
title: Tapping / branch points
paginate: true
---

# Tapping / branch points

Buffers and clock gates often sit where the tree forks

---

## The idea
- Collect steiner and edge endpoints
- Keep points with degree at least three, those are tapping points

---

## Branch taps
![Branch taps](assets/steps/01-def.png)

---

## On MMM
![On MMM](assets/steps/02-mmm.png)

---

## On H-tree
![On H-tree](assets/steps/03-h.png)

---

## Why care
![Why care](assets/steps/04-why.png)

---

## API
![API](assets/steps/05-api.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call `tapping_points(tree)` after `mmm_tree`
- Assert length ≥ 1 on tiny_cts

---

## Pitfalls
- Counting leaf sinks as taps
- Using degree on undirected edges inconsistently
- Dropping steiners before the degree pass

---

## Your turn
- Next: insert buffers on long wires

