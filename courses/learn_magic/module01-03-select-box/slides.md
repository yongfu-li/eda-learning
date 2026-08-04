---
marp: true
title: Why Select
paginate: true
---

# Why Select

Box + select picks geometry for edit / DRC focus

---

## The idea
- GOLDEN: select thin metal1; width=1

---

## Box select
![Box select](assets/steps/01-box.png)

---

## thin shape
![thin shape](assets/steps/02-thin.png)

---

## Edit focus
![Edit focus](assets/steps/03-focus.png)

---

## Width check
![Width check](assets/steps/04-width.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
- Open **select-box**
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
select thin metal1; width=1.
ok if goldens match
```

---

## Next
- Complete the quiz for this part
- Continue the Magic Part A map, then the real CLI track

