---
marp: true
title: Why shorts
paginate: true
---

# Why shorts

A hard short between vdd and vss is catastrophic ERC

---

## The idea
- GOLDEN: supply_short_count=1 via short1

---

## SHORT cell
![SHORT cell](assets/steps/01-short.png)

---

## Pins
![Pins](assets/steps/02-pins.png)

---

## Kinds
![Kinds](assets/steps/03-kinds.png)

---

## Flag
![Flag](assets/steps/04-flag.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call find_supply_shorts(); assert count==1

---

## Pitfalls
- Treating normal INV VDD/VSS as a short
- Missing SHORT cell type

---

## Your turn
- Next: well/substrate ties

