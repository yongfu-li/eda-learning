---
marp: true
title: Reduce
paginate: true
---

# Reduce

Network reduction collapses the chain to in–out R_eq and lumped C_eq

---

## The idea
- GOLDEN: after_nodes=2; R_eq=3.06 C_eq=1.376

---

## Before
![Before](assets/steps/01-before.png)

---

## Series R
![Series R](assets/steps/02-series.png)

---

## Sum C
![Sum C](assets/steps/03-sumc.png)

---

## After
![After](assets/steps/04-after.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call reduce_network(); assert after_nodes==2 and r_eq==3.06 and c_eq==1.376

---

## Pitfalls
- Reducing C before R
- Keeping internal nodes after reduce

---

## Your turn
- Next: back-annotate nets

