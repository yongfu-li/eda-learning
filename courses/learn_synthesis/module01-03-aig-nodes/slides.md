---
marp: true
title: AIG nodes
paginate: true
---

# AIG nodes

AIGs use only AND + optional edge complement , not arbitrary gates yet

---

## The idea
- Each AND has two fanins (id, complemented)
- Evaluate bottom-up with bitwise AND

---

## Kinds
![Kinds](assets/steps/01-kinds.png)

---

## Fanin
![Fanin](assets/steps/02-fanin.png)

---

## Eval
![Eval](assets/steps/03-eval.png)

---

## Select
![Select](assets/steps/04-sel.png)

---

## Count
![Count](assets/steps/05-count.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call output_value for assignments (1,0,1) and (1,1,1)

---

## Pitfalls
- Evaluating complemented edges wrongly
- Mixing PI names with ids

---

## Your turn
- Next: structural hashing

