---
marp: true
title: Why callbacks
paginate: true
---

# Why callbacks

Nonlinear devices expose i(v) and g=di/dv to the MNA Newton loop

---

## The idea
- GOLDEN: diode_loop_newton converges; callback returns i and g at vd

---

## i(v)
![i(v)](assets/steps/01-i.png)

---

## g=di/dv
![g=di/dv](assets/steps/02-g.png)

---

## 1-D loop
![1-D loop](assets/steps/03-loop.png)

---

## Converge
![Converge](assets/steps/04-cv.png)

---

## Hook
![Hook](assets/steps/05-hook.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call device_callback_diode(0.0) and diode_loop_newton(); assert converged

---

## Pitfalls
- Using linear diode model
- Forgetting companion conductance in transient

---

## Your turn
- Next: backward-Euler transient on RC

