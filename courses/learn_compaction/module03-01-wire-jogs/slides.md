---
marp: true
title: Wire jogs
paginate: true
---

# Wire jogs

Wires must bend or stretch when cells move during compaction

---

## The idea
- Add_jog inserts a bend; stretch_wire_to_bbox retargets a horizontal wire to the cell union

---

## Wire W
![Wire W](assets/steps/01-w.png)

---

## Jog
![Jog](assets/steps/02-jog.png)

---

## Stretch
![Stretch](assets/steps/03-stretch.png)

---

## Points
![Points](assets/steps/04-pts.png)

---

## Why
![Why](assets/steps/05-why.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call add_jog on W; stretch_wire_to_bbox after compact_1d

---

## Pitfalls
- Deleting the wire
- Stretching without updating y

---

## Your turn
- Next: shear lite

