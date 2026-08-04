---
marp: true
title: Why algorithms
paginate: true
---

# Why algorithms

Permute source/drain within MOSFET class

---

## The idea
- GOLDEN: permute_ok=True

---

## D/S permute
![D/S permute](assets/steps/01-ds.png)

---

## G fixed
![G fixed](assets/steps/02-gate.png)

---

## nmos rule
![nmos rule](assets/steps/03-nmos.png)

---

## pmos rule
![pmos rule](assets/steps/04-pmos.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab
- Open **permute-pins-algo**

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
permute_ok=True.
ok if goldens match and bind
```

---

## Next
- Complete the quiz for this part
- Continue Part C, then internals

