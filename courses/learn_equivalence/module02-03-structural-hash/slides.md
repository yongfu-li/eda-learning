---
marp: true
title: Struct hash
paginate: true
---

# Struct hash

Structural hashing finds functionally identical subexpressions , the idea behind FRAIG and AIG strashing

---

## The idea
- Spec has 2 unique gates

---

## Hash signatures
![Hash signatures](assets/steps/01-idea.png)

---

## Spec hashes
![Spec hashes](assets/steps/02-spec.png)

---

## Good fraig
![Good fraig](assets/steps/03-good.png)

---

## Not enough alone
![Not enough alone](assets/steps/04-limit.png)

---

## Cleanup first
![Cleanup first](assets/steps/05-use.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call structural_hash_stats(spec) and fraig_lite(impl_good)

---

## Pitfalls
- Hashing by gate id instead of structure
- Expecting full industrial FRAIG fixpoint

---

## Your turn
- Next: SAT / CNF encoding lite

