---
marp: true
title: Why real Netgen
paginate: true
---

# Why real Netgen

LVS report with class count

---

## The idea
- GOLDEN: matched=2/4; mismatch=0; classes=2

---

## report cmd
![report cmd](assets/steps/01-report.png)

---

## Devices
![Devices](assets/steps/02-dev.png)

---

## Nets
![Nets](assets/steps/03-nets.png)

---

## Classes
![Classes](assets/steps/04-class.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab
- Open **real-lvs-report**

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
matched=2/4; mismatch=0; classes=2.
ok if goldens match
```

---

## Next
- Complete the quiz for this part
- Continue Part B evidence track

