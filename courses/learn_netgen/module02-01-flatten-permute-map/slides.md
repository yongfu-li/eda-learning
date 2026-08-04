---
marp: true
title: Why Flatten
paginate: true
---

# Why Flatten

Source/drain pins may permute within a MOSFET class

---

## The idea
- GOLDEN: permute D/S on nmos/pmos

---

## Permute rule
![Permute rule](assets/steps/01-permute.png)

---

## nmos D/S
![nmos D/S](assets/steps/02-nmos.png)

---

## pmos D/S
![pmos D/S](assets/steps/03-pmos.png)

---

## Gate fixed
![Gate fixed](assets/steps/04-gate.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
- Open **flatten-permute-map**
- Run the stage buttons and Check the goldens

---

## Implement track
- From common/, run solvers.py and confirm NETGEN_PARTA_OK

---

## Pitfalls
- Confusing schematic SPICE with layout extract
- Forgetting permute on source/drain

---

## Try these
- From the common folder, run the Netgen map self-test

---

## Try these — try these

```
cd courses/learn_netgen/common
python3 solvers.py
```

---

## Pseudocode
- Here is the check in plain steps

---

## Pseudocode — try these

```
permute D/S on nmos/pmos.
ok if goldens match
```

---

## Next
- Complete the quiz for this part
- Continue the Netgen Part A map, then the real CLI track

