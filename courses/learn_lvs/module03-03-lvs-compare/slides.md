---
marp: true
title: LVS compare
paginate: true
---

# LVS compare

LVS compare checks every pin net after rename , mismatch_count must be zero

---

## The idea
- GOLDEN: mismatch_count=0, matched_nets=4

---

## Rename
![Rename](assets/steps/01-rename.png)

---

## Pins
![Pins](assets/steps/02-pins.png)

---

## Check
![Check](assets/steps/03-check.png)

---

## Nets
![Nets](assets/steps/04-nets.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call lvs_compare(); assert ok and matched_net_count==4

---

## Pitfalls
- Comparing unbound nets
- Ignoring pin direction mismatches as net errors

---

## Your turn
- Next: LVS engine integration

