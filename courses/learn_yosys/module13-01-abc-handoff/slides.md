---
marp: true
title: Why abc
paginate: true
---

# Why abc

Yosys abc is a bridge: you hand an AIG-shaped cone to an external optimizer

---

## The idea
- GOLDEN: abc_aig_ands=3 after opt_merge-shaped handoff

---

## After opt
![After opt](assets/steps/01-opt.png)

---

## AND budget
![AND budget](assets/steps/02-count.png)

---

## Mux cost
![Mux cost](assets/steps/03-mux.png)

---

## abc pass
![abc pass](assets/steps/04-bridge.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
- Open **abc-handoff**
- Count AND nodes for the ABC handoff

---

## Implement track
- Call algo_abc_handoff(); assert aig_ands == 3

---

## Pitfalls
- Counting before merge
- Treating mux as one AND instead of two in this model

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
after opt_merge
and += 1 per dollar and; += 2 per dollar mux
ok if aig_ands == 3
```

---

## Next
- Complete the quiz for this part
- Next: full Yosys algo engine check

