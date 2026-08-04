---
marp: true
title: Device match
paginate: true
---

# Device match

Device match checks binding plus type agreement (nmos↔nmos)

---

## The idea
- GOLDEN: matched_devices=2

---

## Bind
![Bind](assets/steps/01-bind.png)

---

## Type
![Type](assets/steps/02-type.png)

---

## X0
![X0](assets/steps/03-x0.png)

---

## X1
![X1](assets/steps/04-x1.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call match_devices(); assert count==2 and mismatch_count==0

---

## Pitfalls
- Matching by name only without type check
- Skipping unbound devices

---

## Your turn
- Next: LVS graph compare

