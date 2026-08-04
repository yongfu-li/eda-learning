---
marp: true
title: Why Netgen internals
paginate: true
---

# Why Netgen internals

Map Obj / Netlist / Element to the Netgen C tree

---

## The idea
- GOLDEN: Name the three pillars and how Netlist holds devices

---

## Obj
![Obj](assets/steps/01-obj.png)

---

## Netlist
![Netlist](assets/steps/02-netlist.png)

---

## Element
![Element](assets/steps/03-element.png)

---

## Nesting
![Nesting](assets/steps/04-nest.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab
- Open **netcomp-model**

---

## Implement track
- Call netcomp_model() in internals_solvers

---

## Pitfalls
- Treating browser JSON as the C API

---

## Try these
- From the common folder, run the internals self-test

---

## Try these — try these

```
cd courses/learn_netgen/common
python3 internals_solvers.py
```

---

## Pseudocode
- Here is the checklist in plain steps

---

## Pseudocode — try these

```
Name the three pillars and how Netlist holds devices.
ok if goldens match INTERNALS_GOLDENS
```

---

## Next
- Complete the quiz for this part
- Wrap the Netgen path

