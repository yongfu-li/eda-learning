---
marp: true
title: Why algorithms
paginate: true
---

# Why algorithms

Hash devices by nmos/pmos class for compare

---

## The idea
- GOLDEN: hash_device_count=2

---

## Device classes
![Device classes](assets/steps/01-class.png)

---

## Hash buckets
![Hash buckets](assets/steps/02-hash.png)

---

## Schematic side
![Schematic side](assets/steps/03-sch.png)

---

## Layout side
![Layout side](assets/steps/04-lay.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab
- Open **hash-devices-algo**

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
hash_device_count=2.
ok if goldens match and bind
```

---

## Next
- Complete the quiz for this part
- Continue Part C, then internals

