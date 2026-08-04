---
marp: true
title: Why real Magic
paginate: true
---

# Why real Magic

Load tiny_inv, verify paint counts, save .mag

---

## The idea
- GOLDEN: rect_count=6; contact_count=1; cell=tiny_inv

---

## tiny_inv
![tiny_inv](assets/steps/01-cell.png)

---

## Six rects
![Six rects](assets/steps/02-rects.png)

---

## One contact
![One contact](assets/steps/03-contact.png)

---

## save
![save](assets/steps/04-save.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
- Open **real-paint-save**
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
rect_count=6; contact_count=1; cell=tiny_inv.
ok if goldens match
```

---

## Next
- Complete the quiz for this part
- Continue the Part B evidence track, then algorithms and internals

