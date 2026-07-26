---
marp: true
title: Why rewrite
paginate: true
---

# Why rewrite

Rewrite absorbs OR followed by NOT into a single NOR cell

---

## The idea
- GOLDEN: after_rewrite_cells=3, comb=2, seq=1

---

## OR+NOT pair
![OR+NOT pair](assets/steps/01-pair.png)

---

## Absorb to NOR
![Absorb to NOR](assets/steps/02-absorb.png)

---

## Comb count
![Comb count](assets/steps/03-comb.png)

---

## Seq hold
![Seq hold](assets/steps/04-seq.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call pass_rewrite(); assert cell_count==3 and comb_count==2

---

## Pitfalls
- Rewriting DFF
- Missing OR+NOT pattern

---

## Your turn
- Next: techmap area

