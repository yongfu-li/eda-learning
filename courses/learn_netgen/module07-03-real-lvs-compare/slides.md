---
marp: true
title: Why real Netgen
paginate: true
---

# Why real Netgen

Compare nets and devices between sch and lay

---

## The idea
- GOLDEN: matched_nets=4; matched_devices=2; mismatch=0

---

## compare
![compare](assets/steps/01-cmd.png)

---

## Four nets
![Four nets](assets/steps/02-nets.png)

---

## Two devices
![Two devices](assets/steps/03-dev.png)

---

## Zero mismatch
![Zero mismatch](assets/steps/04-mism.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab
- Open **real-lvs-compare**

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
matched_nets=4; matched_devices=2; mismatch=0.
ok if goldens match
```

---

## Next
- Complete the quiz for this part
- Continue Part B evidence track

