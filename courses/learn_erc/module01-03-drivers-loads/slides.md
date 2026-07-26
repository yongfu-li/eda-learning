---
marp: true
title: Why drivers
paginate: true
---

# Why drivers

ERC needs drivers and loads , output pins drive; input pins load

---

## The idea
- GOLDEN: z has 2 drivers; float_n has 0 drivers and 1 load

---

## Out pins
![Out pins](assets/steps/01-out.png)

---

## In pins
![In pins](assets/steps/02-in.png)

---

## z drivers
![z drivers](assets/steps/03-z.png)

---

## float
![float](assets/steps/04-float.png)

---

## Count
![Count](assets/steps/05-count.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call drivers_and_loads(); assert len(by_net['z']['drivers'])==2

---

## Pitfalls
- Treating power pins as drivers
- Ignoring SHORT io pins

---

## Your turn
- Next: floating nets

