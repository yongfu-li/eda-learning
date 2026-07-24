---
marp: true
title: Min period
paginate: true
---

# Min period

Search a small candidate set of retimings , not full WD/FEAS , and pick the smallest legal period

---

## The idea
- Candidates include r=0, forward on a/b, backward on c; best is forward on a with period 5

---

## Try candidates
![Try candidates](assets/steps/01-search.png)

---

## Best P=5
![Best P=5](assets/steps/02-best.png)

---

## Improved
![Improved](assets/steps/03-improve.png)

---

## Cost registers
![Cost registers](assets/steps/04-regs.png)

---

## Sequential API
![Sequential API](assets/steps/05-seq.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call min_period_binary_search(DATA); assert period==5 and legal

---

## Pitfalls
- Assuming backward on c helps
- Expecting full LP optimality

---

## Your turn
- Next: register/area tradeoff

