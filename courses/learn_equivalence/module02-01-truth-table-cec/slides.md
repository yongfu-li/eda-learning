---
marp: true
title: Truth-table CEC
paginate: true
---

# Truth-table CEC

Truth-table CEC enumerates every PI assignment , fine for tiny circuits, infeasible for wide buses

---

## The idea
- Truth_table_cec walks all 8 rows; returns equivalent=True or counterexample dict

---

## Eight rows
![Eight rows](assets/steps/01-eight.png)

---

## Good passes
![Good passes](assets/steps/02-good.png)

---

## Bad fails
![Bad fails](assets/steps/03-bad.png)

---

## Cex a1b1c0
![Cex a1b1c0](assets/steps/04-cex.png)

---

## Scales poorly
![Scales poorly](assets/steps/05-scale.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call truth_table_cec(spec, impl_good) and (spec, impl_bad); assert goldens

---

## Pitfalls
- Stopping at first match instead of first mismatch
- Missing a PI bit in enumeration

---

## Your turn
- Next: structural hashing / FRAIG lite

