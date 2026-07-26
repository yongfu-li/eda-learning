---
marp: true
title: Why sparse
paginate: true
---

# Why sparse

Production SPICE uses sparse LU , count nonzeros and inspect L/U structure

---

## The idea
- GOLDEN: nnz=6 on the toy MNA conductance matrix

---

## NNZ
![NNZ](assets/steps/01-nnz.png)

---

## Factor L
![Factor L](assets/steps/02-l.png)

---

## Factor U
![Factor U](assets/steps/03-u.png)

---

## Fwd/back idea
![Fwd/back idea](assets/steps/04-fb.png)

---

## NNZ 6
![NNZ 6](assets/steps/05-n6.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call sparse_lu_lite(G from dc_linear_solve); assert nnz==6

---

## Pitfalls
- Confusing nnz with matrix dimension
- Expecting fill-in on this tiny dense G

---

## Your turn
- Next: Newton-Raphson on the same stamps

