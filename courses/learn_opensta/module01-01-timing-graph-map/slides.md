---
marp: true
title: Why Timing
paginate: true
---

# Why Timing

Map netlist cells to the OpenSTA timing graph

---

## The idea
- GOLDEN: 3 cells u1/u2/u3; graph nodes = cells + pins

---

## Three cells
![Three cells](assets/steps/01-cells.png)

---

## Pins
![Pins](assets/steps/02-pins.png)

---

## Delay arcs
![Delay arcs](assets/steps/03-arcs.png)

---

## Timing graph
![Timing graph](assets/steps/04-graph.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
- Open **timing-graph-map**
- Run the stage buttons and Check the goldens

---

## Implement track
- From common/, run solvers.py and confirm OPENSTA_MAP_OK

---

## Pitfalls
- Mixing algorithm STA from learn_sta with OpenSTA command names
- Forgetting the clock period when reading slack

---

## Try these
- From the common folder, run the OpenSTA map self-test

---

## Try these — try these

```
cd courses/learn_opensta/common
python3 solvers.py
```

---

## Pseudocode
- Here is the check in plain steps

---

## Pseudocode — try these

```
3 cells u1/u2/u3; graph nodes = cells + pins.
ok if goldens match
```

---

## Next
- Complete the quiz for this part
- Continue the OpenSTA Part A map, then the real CLI track

