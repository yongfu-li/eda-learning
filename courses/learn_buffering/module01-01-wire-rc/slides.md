---
marp: true
title: Wire RC
paginate: true
---

# Wire RC

Every buffering decision starts from how much resistance and capacitance a wire segment carries

---

## The idea
- Wire_rc of length L returns R equals L times r_per and C equals L times c_per
- Elmore delay uses R times C_self over two plus C_load

---

## Net topology
![Net topology](assets/steps/01-net.png)

---

## Edge e0 length
![Edge e0 length](assets/steps/02-e0.png)

---

## R and C
![R and C](assets/steps/03-rc.png)

---

## Elmore
![Elmore](assets/steps/04-elmore.png)

---

## Why it matters
![Why it matters](assets/steps/05-why.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call `wire_rc(length)` and `elmore_delay` in `common/`
- Match GOLDENS.wireRcLen4R

---

## Pitfalls
- Using Euclidean length
- Forgetting C_load in Elmore
- Mixing per-unit R with total R

---

## Your turn
- Next: slew budgets on those RC segments

