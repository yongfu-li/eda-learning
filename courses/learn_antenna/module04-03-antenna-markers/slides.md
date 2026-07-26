---
marp: true
title: Markers
paginate: true
---

# Markers

Signoff antenna emits one marker per violating net (after diode)

---

## The idea
- GOLDEN: marker_count=1 on tiny_antenna

---

## Violations
![Violations](assets/steps/01-viol.png)

---

## n1 marker
![n1 marker](assets/steps/02-n1m.png)

---

## n3 skipped
![n3 skipped](assets/steps/03-n3skip.png)

---

## Kind
![Kind](assets/steps/04-kind.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call collect_markers(); assert count==1

---

## Pitfalls
- Counting raw violations
- Missing diode waiver

---

## Your turn
- Next: antenna engine

