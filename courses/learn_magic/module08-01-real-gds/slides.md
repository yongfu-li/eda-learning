---
marp: true
title: Why real Magic
paginate: true
---

# Why real Magic

Gds write and read layer map from log

---

## The idea
- GOLDEN: gds_layer_count=6; metal1→49

---

## gds write
![gds write](assets/steps/01-cmd.png)

---

## Six layers
![Six layers](assets/steps/02-layers.png)

---

## metal1→49
![metal1→49](assets/steps/03-m1.png)

---

## contact→25
![contact→25](assets/steps/04-contact.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
- Open **real-gds**
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
gds_layer_count=6; metal1→49.
ok if goldens match
```

---

## Next
- Complete the quiz for this part
- Continue the Part B evidence track, then algorithms and internals

