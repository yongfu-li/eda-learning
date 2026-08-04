---
marp: true
title: Why Compare
paginate: true
---

# Why Compare

Match net names between schematic and layout

---

## The idea
- GOLDEN: matched_nets=4

---

## Four nets
![Four nets](assets/steps/01-nets.png)

---

## All match
![All match](assets/steps/02-match.png)

---

## Schematic nets
![Schematic nets](assets/steps/03-sch.png)

---

## Layout nets
![Layout nets](assets/steps/04-lay.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
- Open **compare-nets-map**
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
matched_nets=4.
ok if goldens match
```

---

## Next
- Complete the quiz for this part
- Continue the Netgen Part A map, then the real CLI track

