---
marp: true
title: Net extract
paginate: true
---

# Net extract

Net extraction groups layout shapes into electrically connected nets

---

## The idea
- GOLDEN: 4 layout nets net_a/y/vss/vdd

---

## Shapes
![Shapes](assets/steps/01-shapes.png)

---

## net_a
![net_a](assets/steps/02-net_a.png)

---

## net_y
![net_y](assets/steps/03-net_y.png)

---

## Supplies
![Supplies](assets/steps/04-sup.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call extract_nets(); assert count==4 and ids include net_a, net_y

---

## Pitfalls
- Splitting a net at a via
- Missing port annotation on supplies

---

## Your turn
- Next: layout device–net graph

