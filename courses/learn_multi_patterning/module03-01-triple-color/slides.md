---
marp: true
title: Triple patterning
paginate: true
---

# Triple patterning

When two masks fail, triple patterning assigns three masks with a 3-coloring

---

## The idea
- GOLDEN: colors_used=3, ok=True on tiny_mp

---

## Need 3
![Need 3](assets/steps/01-need.png)

---

## Backtrack
![Backtrack](assets/steps/02-bt.png)

---

## Assign
![Assign](assets/steps/03-asg.png)

---

## Used 3
![Used 3](assets/steps/04-used.png)

---

## Success
![Success](assets/steps/05-ok.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call triple_pattern(method='backtrack'); assert ok and colors_used==3

---

## Pitfalls
- Greedy-only when backtrack is required
- Stopping at 2 colors after stitch lesson

---

## Your turn
- Next: compare greedy vs backtrack decompositions

