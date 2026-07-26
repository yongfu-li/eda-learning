---
marp: true
title: Engine
paginate: true
---

# Engine

A tiny match engine chains single-layer and multi-layer patterns into one marker list

---

## The idea
- GOLDEN match_engine_markers=3 (width 1 + space 1 + enclosure 1)

---

## Pipeline
![Pipeline](assets/steps/01-pipe.png)

---

## Width
![Width](assets/steps/02-w.png)

---

## Space
![Space](assets/steps/03-s.png)

---

## Encl
![Encl](assets/steps/04-e.png)

---

## Total
![Total](assets/steps/05-n.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call match_engine(); assert count==3

---

## Pitfalls
- Stopping after width only
- Double-counting boolean as DRC markers

---

## Your turn
- Next: offline compare, then wrap

