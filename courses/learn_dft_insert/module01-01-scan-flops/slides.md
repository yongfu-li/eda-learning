---
marp: true
title: Why scan flops
paginate: true
---

# Why scan flops

Every flop becomes a scan SDFF in this full-scan toy

---

## The idea
- GOLDEN: scan_cell_count=4

---

## SDFF cells
![SDFF cells](assets/steps/01-sdff.png)

---

## Flop f1
![Flop f1](assets/steps/02-f1.png)

---

## Flop f2
![Flop f2](assets/steps/03-f2.png)

---

## Flop f3
![Flop f3](assets/steps/04-f3.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call identify_scan_flops(); assert count==4

---

## Pitfalls
- Counting only functional flops
- Missing SE hook

---

## Your turn
- Next: scan enable ports

