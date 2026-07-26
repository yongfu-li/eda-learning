---
marp: true
title: Why delay map
paginate: true
---

# Why delay map

Delay-oriented techmap adds buffer NAND for timing literacy

---

## The idea
- GOLDEN: techmap_nand_count_delay=7

---

## Extra buffer NAND
![Extra buffer NAND](assets/steps/01-extra.png)

---

## NOR five NAND
![NOR five NAND](assets/steps/02-nor5.png)

---

## Total NAND
![Total NAND](assets/steps/03-total.png)

---

## Area vs delay
![Area vs delay](assets/steps/04-trade.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call pass_techmap(mode='delay'); assert nand_count==7

---

## Pitfalls
- Expecting same count as area
- Ignoring DFF passthrough

---

## Your turn
- Next: synth script

