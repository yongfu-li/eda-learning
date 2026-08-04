---
marp: true
title: Why Netgen internals
paginate: true
---

# Why Netgen internals

Know where a new Tcl command lives and the minimal stub to build

---

## The idea
- GOLDEN: tclcmd/cmd_lvs.c + register + Makefile + netgen help lvs

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

## Browser lab
- Open **contribute-netgen**

---

## Implement track
- Call contribute_netgen() in internals_solvers

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
tclcmd/cmd_lvs.c + register + Makefile + netgen help lvs.
ok if goldens match INTERNALS_GOLDENS
```

---

## Next
- Complete the quiz for this part
- Wrap the Netgen path

