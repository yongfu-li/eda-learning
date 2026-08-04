---
marp: true
title: Why real Netgen
paginate: true
---

# Why real Netgen

Name device prefixes and port/pin vocabulary

---

## The idea
- GOLDEN: Devices=2; nets=4; classes nmos/pmos

---

## M/X prefixes
![M/X prefixes](assets/steps/01-prefix.png)

---

## Four ports
![Four ports](assets/steps/02-ports.png)

---

## G,D,S pins
![G,D,S pins](assets/steps/03-pins.png)

---

## Classes
![Classes](assets/steps/04-class.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab
- Open **spice-vocab**

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
Devices=2; nets=4; classes nmos/pmos.
ok if goldens match
```

---

## Next
- Complete the quiz for this part
- Continue Part B evidence track

