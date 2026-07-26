---
marp: true
title: Why floating
paginate: true
---

# Why floating

A floating net has loads but no driver , classic ERC fail

---

## The idea
- GOLDEN: floating_nets=['float_n'], count=1

---

## No driver
![No driver](assets/steps/01-nodrv.png)

---

## Has load
![Has load](assets/steps/02-load.png)

---

## Not port
![Not port](assets/steps/03-port.png)

---

## Not supply
![Not supply](assets/steps/04-sup.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call find_floating_nets(); assert nets==['float_n']

---

## Pitfalls
- Flagging primary inputs as floating
- Ignoring unused well nets

---

## Your turn
- Next: undriven inputs

