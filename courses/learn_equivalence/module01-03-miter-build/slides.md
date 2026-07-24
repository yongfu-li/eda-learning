---
marp: true
title: Miter build
paginate: true
---

# Miter build

A miter merges spec and impl and XORs their outputs , equivalent designs yield miter PO=0 everywhere

---

## The idea
- Build_miter(spec, impl_good) adds i_-prefixed impl gates and miter_xor = spec_f XOR impl_f

---

## XOR outputs
![XOR outputs](assets/steps/01-idea.png)

---

## Build good miter
![Build good miter](assets/steps/02-build.png)

---

## Good → all zero
![Good → all zero](assets/steps/03-zero.png)

---

## Bad → one
![Bad → one](assets/steps/04-one.png)

---

## Why miters
![Why miters](assets/steps/05-use.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call build_miter(spec, impl_good); miter_output must be 0 on every assignment

---

## Pitfalls
- XORing inputs instead of outputs
- Forgetting to clear old output flags

---

## Your turn
- Next: exhaustive truth-table CEC

