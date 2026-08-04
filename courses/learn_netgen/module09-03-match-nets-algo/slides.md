---
marp: true
title: Why algorithms
paginate: true
---

# Why algorithms

Match net names between schematic and layout

---

## The idea
- GOLDEN: matched_nets=4

---

## Schematic nets
![Schematic nets](assets/steps/01-sch.png)

---

## Layout nets
![Layout nets](assets/steps/02-lay.png)

---

## Intersection
![Intersection](assets/steps/03-inter.png)

---

## Match algo
![Match algo](assets/steps/04-algo.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab
- Open **match-nets-algo**

---

## Implement track
- Run algo_solvers.py and partc_bind.py

---

## Pitfalls
- Changing tiny_algo_netgen without updating Part B goldens

---

## Try these
- From the common folder, run the Part C self-tests

---

## Try these — try these

```
cd courses/learn_netgen/common
python3 algo_solvers.py
python3 partc_bind.py
```

---

## Pseudocode
- Here is the check in plain steps

---

## Pseudocode — try these

```
matched_nets=4.
ok if goldens match and bind
```

---

## Next
- Complete the quiz for this part
- Continue Part C, then internals

