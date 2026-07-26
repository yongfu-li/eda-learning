---
marp: true
title: Why wells
paginate: true
---

# Why wells

Wells must tie to the right rail , nwell→power, pwell→ground

---

## The idea
- GOLDEN: well_error_count=1 , nw1 nwell tied to vss

---

## nwell rule
![nwell rule](assets/steps/01-nwell.png)

---

## Bad tie
![Bad tie](assets/steps/02-bad.png)

---

## Expected
![Expected](assets/steps/03-exp.png)

---

## pwell note
![pwell note](assets/steps/04-pwell.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call find_well_errors(); assert count==1

---

## Pitfalls
- Accepting nwell→vss
- Ignoring well records

---

## Your turn
- Next: collect ERC markers

