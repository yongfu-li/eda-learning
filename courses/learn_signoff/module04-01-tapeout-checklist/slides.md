---
marp: true
title: Why tapeout
paginate: true
---

# Why tapeout

Required tapeout gates block release until checks are clean

---

## The idea
- GOLDEN: ready=false before ECO, ready=true after

---

## Checklist
![Checklist](assets/steps/01-items.png)

---

## Before ECO
![Before ECO](assets/steps/02-before.png)

---

## Layout gate
![Layout gate](assets/steps/03-t2.png)

---

## After ECO
![After ECO](assets/steps/04-after.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call tapeout_checklist(after_eco=False/True); assert ready flags

---

## Pitfalls
- Ignoring optional vs required
- Checking before ECO only

---

## Your turn
- Next: signoff markers

