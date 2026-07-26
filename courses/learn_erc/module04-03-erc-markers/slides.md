---
marp: true
title: Why markers
paginate: true
---

# Why markers

Signoff ERC emits markers , one record per violation class hit

---

## The idea
- GOLDEN: marker_count=5 on tiny_erc

---

## Floating m
![Floating m](assets/steps/01-float.png)

---

## Undriven m
![Undriven m](assets/steps/02-undrv.png)

---

## Multi m
![Multi m](assets/steps/03-multi.png)

---

## Short+well
![Short+well](assets/steps/04-sw.png)

---

## Count 5
![Count 5](assets/steps/05-count.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call collect_markers(); assert count==5

---

## Pitfalls
- Double-counting float as two markers incorrectly in the golden
- Missing well

---

## Your turn
- Next: erc_engine integration

