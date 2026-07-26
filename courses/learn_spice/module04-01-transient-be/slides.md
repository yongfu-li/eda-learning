---
marp: true
title: Why transient
paginate: true
---

# Why transient

Transient analysis steps time: capacitors use companion models at each dt

---

## The idea
- GOLDEN: dt=0.5, 4 steps, final_v2≈2.255181 (BE RC from v2_init=0)

---

## Companion
![Companion](assets/steps/01-comp.png)

---

## dt
![dt](assets/steps/02-dt.png)

---

## Step 1
![Step 1](assets/steps/03-s1.png)

---

## Waveform
![Waveform](assets/steps/04-wav.png)

---

## Final
![Final](assets/steps/05-fin.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call transient_be(dt=0.5, steps=4); assert abs(final_v2-2.255181)<1e-5

---

## Pitfalls
- Using forward Euler by mistake
- Wrong initial capacitor voltage

---

## Your turn
- Next: OP then TRAN pipeline

