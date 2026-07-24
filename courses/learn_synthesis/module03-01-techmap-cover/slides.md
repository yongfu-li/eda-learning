---
marp: true
title: Techmap
paginate: true
---

# Techmap

A cover assigns a library cell to each subject node (or cut)

---

## The idea
- Greedy: AND→AND2, AND(~,~)→NOR2, plus INV per complemented edge; sum areas

---

## Run
![Run](assets/steps/01-run.png)

---

## Area
![Area](assets/steps/02-area.png)

---

## NOR
![NOR](assets/steps/03-nor.png)

---

## Inv
![Inv](assets/steps/04-inv.png)

---

## Cuts
![Cuts](assets/steps/05-cuts.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call techmap_area; assert area ≥ mapAreaMin

---

## Pitfalls
- Forgetting INV cost
- Mapping PIs to gates

---

## Your turn
- Next: area vs delay tradeoff

