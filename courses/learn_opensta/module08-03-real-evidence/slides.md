---
marp: true
title: Why real OpenSTA
paginate: true
---

# Why real OpenSTA

Run the full real OpenSTA engine against goldens

---

## The idea
- GOLDEN: real_opensta_engine ok=True

---

## Full recipe
![Full recipe](assets/steps/01-recipe.png)

---

## Cells golden
![Cells golden](assets/steps/02-cells.png)

---

## Path golden
![Path golden](assets/steps/03-path.png)

---

## Slack golden
![Slack golden](assets/steps/04-slack.png)

---

## Engine
![Engine](assets/steps/05-golden.png)

---

## Browser lab track
- Open **opensta-evidence**
- Build the Tcl recipe or open evidence stages, then Check

---

## Implement track
- From common/, run real_solvers.py and confirm REAL_OPENSTA_OK

---

## Pitfalls
- Editing goldens by hand without re-running sta
- Confusing Part A map JSON with real liberty delays

---

## Try these
- From the common folder, run the real OpenSTA self-test

---

## Try these — try these

```
cd courses/learn_opensta/common
python3 real_solvers.py
```

---

## Pseudocode
- Here is the check in plain steps

---

## Pseudocode — try these

```
real_opensta_engine ok=True.
ok if goldens match
```

---

## Next
- Complete the quiz for this part
- Continue the Part B evidence track, then wrap , algorithms and internals come later

