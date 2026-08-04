---
marp: true
title: Why Netgen
paginate: true
---

# Why Netgen

Run the full Part A engine; ok when every golden matches

---

## The idea
- GOLDEN: netgen_engine ok=True

---

## Read ok
![Read ok](assets/steps/01-read.png)

---

## Classes ok
![Classes ok](assets/steps/02-class.png)

---

## Permute ok
![Permute ok](assets/steps/03-perm.png)

---

## Compare ok
![Compare ok](assets/steps/04-cmp.png)

---

## Engine golden
![Engine golden](assets/steps/05-golden.png)

---

## Browser lab track
- Open **netgen-engine**
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
netgen_engine ok=True.
ok if goldens match
```

---

## Next
- Complete the quiz for this part
- Continue the Netgen Part A map, then the real CLI track

