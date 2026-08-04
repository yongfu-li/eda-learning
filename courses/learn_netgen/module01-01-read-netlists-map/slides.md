---
marp: true
title: Why Read
paginate: true
---

# Why Read

Read schematic and layout SPICE-like netlists

---

## The idea
- GOLDEN: sch/lay devices=2

---

## Schematic
![Schematic](assets/steps/01-sch.png)

---

## Layout
![Layout](assets/steps/02-lay.png)

---

## Four ports
![Four ports](assets/steps/03-ports.png)

---

## read command
![read command](assets/steps/04-read.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
- Open **read-netlists-map**
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
sch/lay devices=2.
ok if goldens match
```

---

## Next
- Complete the quiz for this part
- Continue the Netgen Part A map, then the real CLI track

