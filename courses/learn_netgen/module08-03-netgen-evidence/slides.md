---
marp: true
title: Why real Netgen
paginate: true
---

# Why real Netgen

Run the full real Netgen engine against goldens

---

## The idea
- GOLDEN: real_netgen_engine ok=True

---

## Full recipe
![Full recipe](assets/steps/01-recipe.png)

---

## Read golden
![Read golden](assets/steps/02-read.png)

---

## Compare golden
![Compare golden](assets/steps/03-cmp.png)

---

## Report golden
![Report golden](assets/steps/04-rep.png)

---

## Engine
![Engine](assets/steps/05-golden.png)

---

## Browser lab
- Open **netgen-evidence**

---

## Implement track
- Run real_solvers.py , REAL_NETGEN_OK

---

## Pitfalls
- Editing goldens without re-running scripts

---

## Try these
- From the common folder, run the real Netgen self-test

---

## Try these — try these

```
cd courses/learn_netgen/common
python3 real_solvers.py
```

---

## Pseudocode
- Here is the check in plain steps

---

## Pseudocode — try these

```
real_netgen_engine ok=True.
ok if goldens match
```

---

## Next
- Complete the quiz for this part
- Continue Part B evidence track

