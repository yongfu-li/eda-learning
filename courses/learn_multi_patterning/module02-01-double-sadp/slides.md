---
marp: true
title: SADP lite
paginate: true
---

# SADP lite

SADP is not LELE coloring , mandrels print first; spacers form between mandrels

---

## The idea
- GOLDEN: mandrel_count=3 (A, D, F on the toy greedy pick)

---

## Mandrel
![Mandrel](assets/steps/01-man.png)

---

## Spacer
![Spacer](assets/steps/02-sp.png)

---

## Independent set
![Independent set](assets/steps/03-ind.png)

---

## Assign
![Assign](assets/steps/04-asg.png)

---

## Count 3
![Count 3](assets/steps/05-n.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call sadp_assign(); assert mandrel_count==3

---

## Pitfalls
- Treating SADP as 2-coloring
- Expecting same result as LELE

---

## Your turn
- Next: stitch to break odd cycles

