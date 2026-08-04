---
marp: true
title: Why real Netgen
paginate: true
---

# Why real Netgen

Invoke netgen -batch script.tcl; recipe starts read_sch→read_lay

---

## The idea
- GOLDEN: First two cmds: read_sch, read_lay

---

## netgen -batch
![netgen -batch](assets/steps/01-invoke.png)

---

## read sch
![read sch](assets/steps/02-sch.png)

---

## read lay
![read lay](assets/steps/03-lay.png)

---

## compare
![compare](assets/steps/04-compare.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab
- Open **netgen-cli**

---

## Implement track
- Run real_solvers.py , REAL_NETGEN_OK

---

## Pitfalls
- Editing goldens without re-running scripts

---

## Try these
- From the common folder, run the real Netgen self-test

---

## Try these — try these

```
cd courses/learn_netgen/common
python3 real_solvers.py
```

---

## Pseudocode
- Here is the check in plain steps

---

## Pseudocode — try these

```
First two cmds: read_sch, read_lay.
ok if goldens match
```

---

## Next
- Complete the quiz for this part
- Continue Part B evidence track

