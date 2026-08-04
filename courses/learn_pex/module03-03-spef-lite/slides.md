---
marp: true
title: SPEF-lite
paginate: true
---

# SPEF-lite

SPEF-lite records one *RES and one *CAP from the reduced network

---

## The idea
- GOLDEN: 1 RES + 1 CAP

---

## Header
![Header](assets/steps/01-header.png)

---

## RES
![RES](assets/steps/02-res.png)

---

## CAP
![CAP](assets/steps/03-cap.png)

---

## Counts
![Counts](assets/steps/04-counts.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call emit_spef_lite(); assert res_count==1 and cap_count==1

---

## Pitfalls
- Emitting per-segment instead of reduced
- Missing *NET line

---

## Your turn
- Next: PEX engine integration

