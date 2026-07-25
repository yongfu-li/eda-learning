---
marp: true
title: Sequential
paginate: true
---

# Sequential

A full pass chains axis compaction and wire repair like a tiny cleaner

---

## The idea
- GOLDEN: width 20→14, legal=True, improved=True

---

## Pipeline
![Pipeline](assets/steps/01-pipe.png)

---

## Width
![Width](assets/steps/02-width.png)

---

## Legal
![Legal](assets/steps/03-legal.png)

---

## Improved
![Improved](assets/steps/04-imp.png)

---

## Done
![Done](assets/steps/05-done.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call sequential_compact(DATA); assert final_width==14 and legal

---

## Pitfalls
- Skipping wire stretch
- Claiming illegal layouts are OK

---

## Your turn
- Next: offline benchmark, then wrap

