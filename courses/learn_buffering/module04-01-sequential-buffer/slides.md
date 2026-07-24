---
marp: true
title: Sequential
paginate: true
---

# Sequential

Production flows chain heuristics; this lab is the toy pipeline

---

## The idea
- Sequential_buffer builds sites, runs Van Ginneken, optionally adds fanout buffers

---

## Pipeline
![Pipeline](assets/steps/01-pipe.png)

---

## Run pass
![Run pass](assets/steps/02-run.png)

---

## Metrics
![Metrics](assets/steps/03-met.png)

---

## Mode slew
![Mode slew](assets/steps/04-slew.png)

---

## Handoff
![Handoff](assets/steps/05-done.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call `sequential_buffer(data)`
- Assert sites and van_ginneken keys exist

---

## Pitfalls
- Skipping prune
- Mixing modes without clearing buffers
- Ignoring fanout stage

---

## Your turn
- Next: offline compare, then wrap

