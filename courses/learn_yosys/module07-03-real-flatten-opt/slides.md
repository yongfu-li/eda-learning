---
marp: true
title: Why real
paginate: true
---

# Why real

Flatten inlines child into top; opt merges identical cells and cleans dead logic

---

## The idea
- GOLDEN: flatten modules=1 cells=4; opt cells=4 and_count=1

---

## Before flatten
![Before flatten](assets/steps/01-hier.png)

---

## flatten
![flatten](assets/steps/02-flat.png)

---

## Four cells
![Four cells](assets/steps/03-four.png)

---

## opt merge
![opt merge](assets/steps/04-opt.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
- Open **real-flatten-opt**
- Open **real-flatten-opt**
- Show flatten then opt stages

---

## Implement track
- Call pass_real_flatten_opt(); assert ok

---

## Pitfalls
- Expecting module_count=2 after flatten
- Counting instance cells after flatten

---

## Try these
- From the common folder

---

## Try these — try these

```
cd courses/learn_yosys/common
python3 real_solvers.py
```

---

## Pseudocode
- Here is the check in plain steps

---

## Pseudocode — try these

```
flatten then opt
assert modules=1 cells=4 and=1
```

---

## Next
- Complete the quiz for this part
- Next: aigmap + synth

