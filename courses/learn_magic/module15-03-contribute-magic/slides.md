---
marp: true
title: Why Magic internals
paginate: true
---

# Why Magic internals

Know where a new Tcl command lives and the minimal stub to build

---

## The idea
- GOLDEN: commands/cmd_drc.c + Tcl register + Makefile + magic -help drc

---

## Tree layout
![Tree layout](assets/steps/01-tree.png)

---

## Stub file
![Stub file](assets/steps/02-stub.png)

---

## Makefile hook
![Makefile hook](assets/steps/03-build.png)

---

## Smoke
![Smoke](assets/steps/04-smoke.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
- Open **contribute-magic**
- Click through stages and check goldens

---

## Implement track
- Call contribute_magic() in internals_solvers; assert golden match

---

## Pitfalls
- Treating browser JSON as the C API
- Confusing Tile with OpenSTA Graph

---

## Try these
- From the common folder, run the internals self-test

---

## Try these — try these

```
cd courses/learn_magic/common
python3 internals_solvers.py
```

---

## Pseudocode
- Here is the checklist in plain steps

---

## Pseudocode — try these

```
commands/cmd_drc.c + Tcl register + Makefile + magic -help drc.
```

---

## Next
- Complete the quiz for this part
- Wrap the Magic path , map, CLI evidence, algorithms, and C tree literacy

