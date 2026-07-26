---
marp: true
title: Why area map
paginate: true
---

# Why area map

Techmap maps AND/NOR to a NAND2 library minimizing cell count

---

## The idea
- GOLDEN: techmap_nand_count_area=6

---

## NAND2 library
![NAND2 library](assets/steps/01-lib.png)

---

## AND → 2 NAND
![AND → 2 NAND](assets/steps/02-and.png)

---

## NOR → 4 NAND
![NOR → 4 NAND](assets/steps/03-nor.png)

---

## NAND count
![NAND count](assets/steps/04-count.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call pass_techmap(mode='area'); assert nand_count==6

---

## Pitfalls
- Counting DFF as NAND
- Using delay mapping

---

## Your turn
- Next: techmap delay

