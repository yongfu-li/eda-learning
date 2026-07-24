---
marp: true
title: Forward
paginate: true
---

# Forward

Forward retiming pulls registers toward outputs , decrease r(v) on the chosen node

---

## The idea
- Forward_retime('a', r, 1) sets r(a)=−1; e0 w_r becomes 0; e1/e4 gain registers

---

## Forward −r
![Forward −r](assets/steps/01-def.png)

---

## Pick a
![Pick a](assets/steps/02-pick.png)

---

## Apply forward
![Apply forward](assets/steps/03-apply.png)

---

## Period 8→5
![Period 8→5](assets/steps/04-period.png)

---

## Registers 2→3
![Registers 2→3](assets/steps/05-regs.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call forward_retime('a', r, 1); print apply_retime edges and clock_period

---

## Pitfalls
- Decreasing r on PI/PO
- Applying forward on c first and breaking legality

---

## Your turn
- Next: backward retiming on c

