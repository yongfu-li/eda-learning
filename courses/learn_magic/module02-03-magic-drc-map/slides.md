---
marp: true
title: Why Magic
paginate: true
---

# Why Magic

Run DRC width check; find violation on thin metal1

---

## The idea
- GOLDEN: drc_error_count=1 on thin

---

## drc check
![drc check](assets/steps/01-drc.png)

---

## min_width
![min_width](assets/steps/02-rule.png)

---

## Violation
![Violation](assets/steps/03-thin.png)

---

## Error count
![Error count](assets/steps/04-error.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
- Open **magic-drc-map**
- Run the stage buttons and Check the goldens

---

## Implement track
- From common/, run solvers.py and confirm MAGIC_PARTA_OK

---

## Pitfalls
- Mixing KLayout viewer shortcuts with Magic paint commands
- Forgetting min_width when reading DRC errors

---

## Try these
- From the common folder, run the Magic map self-test

---

## Try these — try these

```
cd courses/learn_magic/common
python3 solvers.py
```

---

## Pseudocode
- Here is the check in plain steps

---

## Pseudocode — try these

```
drc_error_count=1 on thin.
ok if goldens match
```

---

## Next
- Complete the quiz for this part
- Continue the Magic Part A map, then the real CLI track

