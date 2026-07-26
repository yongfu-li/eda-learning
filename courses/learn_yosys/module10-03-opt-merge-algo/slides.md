---
marp: true
title: Why opt merge
paginate: true
---

# Why opt merge

Identical gates sharing inputs are the same node; merge retargets fans

---

## The idea
- GOLDEN: after merge and_count=1 (one duplicate AND removed)

---

## Duplicate AND
![Duplicate AND](assets/steps/01-dup.png)

---

## Hash key
![Hash key](assets/steps/02-hash.png)

---

## Merge
![Merge](assets/steps/03-merge.png)

---

## One AND
![One AND](assets/steps/04-one.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
- Open **opt-merge-algo**
- Merge the twin ANDs and Check and_count

---

## Implement track
- Call algo_opt_merge(); assert and_count == 1

---

## Pitfalls
- Merging cells with different inputs
- Forgetting to remap fanins

---

## Try these
- From the common folder, run the algo solvers self-test, or call `algo_opt_merge` directly

---

## Try these — try these

```
cd courses/learn_yosys/common
python3 algo_solvers.py
```

---

## Pseudocode
- Here is the check in plain steps

---

## Pseudocode — try these

```
after opt_clean
key ← (type,A,B) for and/or
if key seen: remap Y and drop duplicate
ok if and_count == 1
```

---

## Next
- Complete the quiz for this part
- Next: techmap with a map file

