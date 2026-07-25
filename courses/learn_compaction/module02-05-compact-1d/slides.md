---
marp: true
title: 1-D compact
paginate: true
---

# 1-D compact

One axis at a time: build graph, longest-path, rewrite coordinates

---

## The idea
- GOLDEN: X compaction before_span=20, after_span=14, improved=True

---

## Before
![Before](assets/steps/01-before.png)

---

## Run
![Run](assets/steps/02-run.png)

---

## After
![After](assets/steps/03-after.png)

---

## Gaps
![Gaps](assets/steps/04-gaps.png)

---

## Y untouched
![Y untouched](assets/steps/05-y.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call compact_1d(DATA,'x'); assert after_span==14

---

## Pitfalls
- Expecting Y to change
- Ignoring improved flag

---

## Your turn
- Next: 2-D compaction

