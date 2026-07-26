---
marp: true
title: Why undriven
paginate: true
---

# Why undriven

Undriven inputs are the pin-level view of floating connectivity

---

## The idea
- GOLDEN: one hit , u2.A on float_n

---

## Scan loads
![Scan loads](assets/steps/01-scan.png)

---

## Driver?
![Driver?](assets/steps/02-drv.png)

---

## Primary in
![Primary in](assets/steps/03-pi.png)

---

## Hit
![Hit](assets/steps/04-hit.png)

---

## Count
![Count](assets/steps/05-count.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call find_undriven_inputs(); assert count==1 and hits[0].net=='float_n'

---

## Pitfalls
- Flagging port a as undriven
- Missing the float_n load

---

## Your turn
- Next: multi-driven nets

