---
marp: true
title: Why flatten
paginate: true
---

# Why flatten

Flatten merges child hierarchy so later passes see one module

---

## The idea
- GOLDEN: after_flatten_modules=1

---

## Two modules
![Two modules](assets/steps/01-two.png)

---

## child DFF
![child DFF](assets/steps/02-child.png)

---

## Flatten pass
![Flatten pass](assets/steps/03-flat.png)

---

## All in top
![All in top](assets/steps/04-top.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call pass_hierarchy_flatten(); assert module_count==1

---

## Pitfalls
- Flattening before proc
- Forgetting DFF in child

---

## Your turn
- Next: opt/DCE

