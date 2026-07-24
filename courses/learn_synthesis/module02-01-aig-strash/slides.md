---
marp: true
title: Strash
paginate: true
---

# Strash

Strash reuses identical AND structures so the graph stays compact

---

## The idea
- Canonical key sorts the two literals; table maps key → node id

---

## Table
![Table](assets/steps/01-table.png)

---

## Key
![Key](assets/steps/02-key.png)

---

## Lookup
![Lookup](assets/steps/03-lookup.png)

---

## No dup
![No dup](assets/steps/04-dup.png)

---

## Why
![Why](assets/steps/05-why.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call build_strash_table; assert len==4

---

## Pitfalls
- Forgetting to sort fanins
- Hashing node id instead of literals

---

## Your turn
- Next: local rewrite opportunities

