---
marp: true
title: Why algorithms
paginate: true
---

# Why algorithms

Extract device/active nodes from poly/ndiff/pdiff

---

## The idea
- GOLDEN: extract_nodes=3

---

## Gate poly
![Gate poly](assets/steps/01-poly.png)

---

## ndiff
![ndiff](assets/steps/02-nd.png)

---

## pdiff
![pdiff](assets/steps/03-pd.png)

---

## Three nodes
![Three nodes](assets/steps/04-nodes.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
- Open **extract-algo**
- Run connectivity / DRC / extract / bind, then Check

---

## Implement track
- From common/, run algo_solvers.py and partc_bind.py

---

## Pitfalls
- Changing tiny_algo_magic without updating Part B goldens
- Ignoring the bind side

---

## Try these
- From the common folder, run the Part C self-tests

---

## Try these — try these

```
cd courses/learn_magic/common
python3 algo_solvers.py
python3 partc_bind.py
```

---

## Pseudocode
- Here is the check in plain steps

---

## Pseudocode — try these

```
extract_nodes=3.
ok if goldens match and bind
```

---

## Next
- Complete the quiz for this part
- Continue Part C, then internals literacy

