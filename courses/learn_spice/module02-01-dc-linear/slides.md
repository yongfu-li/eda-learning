---
marp: true
title: Why DC
paginate: true
---

# Why DC

Linear DC finds the operating point before Newton or transient analysis

---

## The idea
- GOLDEN: V1=5.0, V2=3.0 from the divider 5×3/(2+3)

---

## Build
![Build](assets/steps/01-build.png)

---

## Solve
![Solve](assets/steps/02-solve.png)

---

## V1=5
![V1=5](assets/steps/03-v1.png)

---

## V2=3
![V2=3](assets/steps/04-v2.png)

---

## Golden
![Golden](assets/steps/05-g.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call dc_linear_solve(); assert abs(volts['2']-3.0)<1e-9 and volts['1']==5.0

---

## Pitfalls
- Including diode in linear DC
- Wrong divider formula

---

## Your turn
- Next: sparse LU literacy on G

