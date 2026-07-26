---
marp: true
title: Markers
paginate: true
---

# Markers

A marker is a typed hit (width/space/…) pointing at shapes , DRC later maps markers to violations

---

## The idea
- Emit_markers combines width and space → at least 2 markers (D + A–B)

---

## Types
![Types](assets/steps/01-types.png)

---

## Width hit
![Width hit](assets/steps/02-w.png)

---

## Space hit
![Space hit](assets/steps/03-s.png)

---

## List
![List](assets/steps/04-list.png)

---

## Count
![Count](assets/steps/05-n.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call emit_markers(); assert len >= 2

---

## Pitfalls
- Dropping value/limit fields
- Mixing multi-layer into emit early

---

## Your turn
- Next: multi-layer via enclosure

