---
marp: true
title: Leaf cells
paginate: true
---

# Leaf cells

Compaction starts from leaf geometries , cells and wires with axis-aligned boxes

---

## The idea
- A,B,C are cells; W is a horizontal wire
- GOLDEN: 4 objects, bbox width 20, height 6

---

## Objects
![Objects](assets/steps/01-obj.png)

---

## Cell A
![Cell A](assets/steps/02-a.png)

---

## B and C
![B and C](assets/steps/03-bc.png)

---

## BBox
![BBox](assets/steps/04-bbox.png)

---

## Count
![Count](assets/steps/05-count.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call layout_stats; assert object_count==4 and width==20

---

## Pitfalls
- Treating wire as a cell
- Confusing chip size with bbox

---

## Your turn
- Next: spacing / gap rules

