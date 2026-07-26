---
marp: true
title: Why markers
paginate: true
---

# Why markers

Signoff emits markers for each failing check before ECO

---

## The idea
- GOLDEN: marker_count=2

---

## Check fail
![Check fail](assets/steps/01-kind.png)

---

## STA marker
![STA marker](assets/steps/02-sta.png)

---

## Antenna marker
![Antenna marker](assets/steps/03-ant.png)

---

## No pass markers
![No pass markers](assets/steps/04-pass.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call collect_markers(); assert count==2

---

## Pitfalls
- Counting pass checks
- Markers after ECO without reset

---

## Your turn
- Next: signoff engine

