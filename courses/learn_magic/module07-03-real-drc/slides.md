---
marp: true
title: Why real Magic
paginate: true
---

# Why real Magic

Run drc check; find width violation on thin metal1

---

## The idea
- GOLDEN: drc_error_count=1; thin on metal1

---

## drc check
![drc check](assets/steps/01-cmd.png)

---

## thin metal1
![thin metal1](assets/steps/02-thin.png)

---

## metal1
![metal1](assets/steps/03-layer.png)

---

## One error
![One error](assets/steps/04-count.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
- Open **real-drc**
- Build the Magic recipe or open evidence stages, then Check

---

## Implement track
- From common/, run real_solvers.py and confirm REAL_MAGIC_OK

---

## Pitfalls
- Editing goldens by hand without re-running scripts
- Confusing Part A map JSON with checked-in logs

---

## Try these
- From the common folder, run the real Magic self-test

---

## Try these — try these

```
cd courses/learn_magic/common
python3 real_solvers.py
```

---

## Pseudocode
- Here is the check in plain steps

---

## Pseudocode — try these

```
drc_error_count=1; thin on metal1.
ok if goldens match
```

---

## Next
- Complete the quiz for this part
- Continue the Part B evidence track, then algorithms and internals

