---
marp: true
title: Why scan enable
paginate: true
---

# Why scan enable

Scan enable muxes functional vs scan data; SI/SO bookend the chain

---

## The idea
- GOLDEN: se=scan_enable, si=scan_in, so=scan_out

---

## SE port
![SE port](assets/steps/01-se.png)

---

## SI port
![SI port](assets/steps/02-si.png)

---

## SO port
![SO port](assets/steps/03-so.png)

---

## Port names
![Port names](assets/steps/04-hook.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call scan_enable_port(); assert se/si/so match goldens

---

## Pitfalls
- Confusing SI with functional D
- Wrong port order

---

## Your turn
- Next: chain stitch

