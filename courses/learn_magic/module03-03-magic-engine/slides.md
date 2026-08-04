---
marp: true
title: Why Magic
paginate: true
---

# Why Magic

Run the full Part A engine; ok when every golden matches

---

## The idea
- GOLDEN: magic_engine ok=True

---

## Paint ok
![Paint ok](assets/steps/01-paint.png)

---

## Select ok
![Select ok](assets/steps/02-select.png)

---

## Contact ok
![Contact ok](assets/steps/03-contact.png)

---

## DRC ok
![DRC ok](assets/steps/04-drc.png)

---

## Engine golden
![Engine golden](assets/steps/05-golden.png)

---

## Browser lab track
- Open **magic-engine**
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
magic_engine ok=True.
ok if goldens match
```

---

## Next
- Complete the quiz for this part
- Continue the Magic Part A map, then the real CLI track

