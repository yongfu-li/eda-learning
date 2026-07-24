---
marp: true
title: Area/delay
paginate: true
---

# Area/delay

Mappers optimize different objectives: area, delay, or a blend

---

## The idea
- Area_mode reports area + delay_sum; delay_mode reports depth×AND delay

---

## Trade
![Trade](assets/steps/01-trade.png)

---

## Area mode
![Area mode](assets/steps/02-area.png)

---

## Delay mode
![Delay mode](assets/steps/03-delay.png)

---

## Library
![Library](assets/steps/04-lib.png)

---

## Choice
![Choice](assets/steps/05-choice.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call area_delay_tradeoff; print both modes

---

## Pitfalls
- Treating delay_sum as critical path blindly
- Ignoring depth

---

## Your turn
- Next: full sequential synth pass

