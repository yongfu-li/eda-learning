---
marp: true
title: Why diode
paginate: true
---

# Why diode

Foundry diode cells waive antenna on protected nets , n3 here

---

## The idea
- GOLDEN: violation_count=1 (n1 only after diode)

---

## Protect diode
![Protect diode](assets/steps/01-diode.png)

---

## Skip protected
![Skip protected](assets/steps/02-skip.png)

---

## n1 still
![n1 still](assets/steps/03-n1v.png)

---

## n3 waived
![n3 waived](assets/steps/04-n3ok.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call find_violations(apply_diodes=True); assert count==1 and hits[0]['net']=='n1'

---

## Pitfalls
- Forgetting to apply diode list
- Still flagging n3

---

## Your turn
- Next: jumper break

