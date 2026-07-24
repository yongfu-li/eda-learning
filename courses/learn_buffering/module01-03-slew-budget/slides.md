---
marp: true
title: Slew budget
paginate: true
---

# Slew budget

Slew (transition) is what library cells require; long RC violates the budget

---

## The idea
- Estimate_slew equals k times R times C_total with k about 2.2
- Slew_ok is true when slew is at most the limit, eight on the toy

---

## Slew definition
![Slew definition](assets/steps/01-def.png)

---

## Limit eight
![Limit eight](assets/steps/02-limit.png)

---

## Hot edge
![Hot edge](assets/steps/03-hot.png)

---

## Pass/fail
![Pass/fail](assets/steps/04-ok.png)

---

## Toward insert
![Toward insert](assets/steps/05-next.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call `estimate_slew` and `slew_ok` in solvers
- Assert limit from tiny_buf.json

---

## Pitfalls
- Using delay as slew
- Ignoring C_load
- Hard-coding pass without measuring

---

## Your turn
- Next: place candidate buffer sites along edges

