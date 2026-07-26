---
marp: true
title: Why Newton
paginate: true
---

# Why Newton

Newton-Raphson linearizes nonlinear devices and iterates until the residual drops

---

## The idea
- GOLDEN: 1 iteration with linear-only stamps; v2=3.0

---

## Guess
![Guess](assets/steps/01-guess.png)

---

## Jacobian
![Jacobian](assets/steps/02-jac.png)

---

## Update
![Update](assets/steps/03-upd.png)

---

## Residual
![Residual](assets/steps/04-res.png)

---

## Converged
![Converged](assets/steps/05-conv.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call newton_raphson_dc(include_diode=False); assert iters==1 and v2≈3.0

---

## Pitfalls
- Enabling diode when the lesson is linear convergence
- Wrong tolerance units

---

## Your turn
- Next: device callbacks for diodes

