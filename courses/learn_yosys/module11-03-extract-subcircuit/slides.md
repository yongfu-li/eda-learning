---
marp: true
title: Why extract
paginate: true
---

# Why extract

Extract spots library-shaped cones and collapses them to a single macro

---

## The idea
- GOLDEN: matches=1; macro=ANDOR2

---

## Pattern
![Pattern](assets/steps/01-pat.png)

---

## Match
![Match](assets/steps/02-match.png)

---

## Macro cell
![Macro cell](assets/steps/03-macro.png)

---

## Drop pair
![Drop pair](assets/steps/04-drop.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
- Open **extract-subcircuit**
- Match the ANDOR2 cone and replace it

---

## Implement track
- Call algo_extract_iso(); assert matches == 1 and macro == 'ANDOR2'

---

## Pitfalls
- Running extract after clean removed the dead OR
- Matching OR without an AND driver

---

## Try these
- From the common folder

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
on post-proc netlist
find dollar or fed by dollar and
replace pair with ANDOR2 macro
ok if matches == 1
```

---

## Next
- Complete the quiz for this part
- Next: memory_map algorithm

