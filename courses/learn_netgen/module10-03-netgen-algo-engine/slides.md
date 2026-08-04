---
marp: true
title: Why algorithms
paginate: true
---

# Why algorithms

Run Part C engine and bind to Part B goldens

---

## The idea
- GOLDEN: engine ok; bind matched 2/4 mismatch 0

---

## Hash ok
![Hash ok](assets/steps/01-hash.png)

---

## Match ok
![Match ok](assets/steps/02-match.png)

---

## Permute ok
![Permute ok](assets/steps/03-perm.png)

---

## Bind Part B
![Bind Part B](assets/steps/04-bind.png)

---

## Engine
![Engine](assets/steps/05-golden.png)

---

## Browser lab
- Open **netgen-algo-engine**

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
engine ok; bind matched 2/4 mismatch 0.
ok if goldens match and bind
```

---

## Next
- Complete the quiz for this part
- Continue Part C, then internals

