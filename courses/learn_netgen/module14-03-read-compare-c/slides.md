---
marp: true
title: Why Netgen internals
paginate: true
---

# Why Netgen internals

Read the compare flow bound to Part B goldens

---

## The idea
- GOLDEN: read_sch→read_lay→hash→match→emit (matched=2/4)

---

## read_sch
![read_sch](assets/steps/01-sch.png)

---

## read_lay
![read_lay](assets/steps/02-lay.png)

---

## hash_devices
![hash_devices](assets/steps/03-hash.png)

---

## match_nets
![match_nets](assets/steps/04-match.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab
- Open **read-compare-c**

---

## Implement track
- Call read_compare_c() in internals_solvers

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
read_sch→read_lay→hash→match→emit (matched=2/4).
ok if goldens match INTERNALS_GOLDENS
```

---

## Next
- Complete the quiz for this part
- Wrap the Netgen path

