---
marp: true
title: Why markers
paginate: true
---

# Why markers

Signoff power/IR emits markers for IR drop and EM hits

---

## The idea
- GOLDEN: marker_count=4

---

## IR marker
![IR marker](assets/steps/01-ir.png)

---

## EM markers
![EM markers](assets/steps/02-em.png)

---

## Marker kinds
![Marker kinds](assets/steps/03-kind.png)

---

## Collect all
![Collect all](assets/steps/04-collect.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call collect_markers(); assert count==4

---

## Pitfalls
- Counting only IR
- Missing EM edges

---

## Your turn
- Next: power engine

