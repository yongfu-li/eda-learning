---
marp: true
title: Why algorithms
paginate: true
---

# Why algorithms

Build the timing graph from pins and delay arcs

---

## The idea
- GOLDEN: 5 pins, 4 arcs; cells u1/u2/u3

---

## Pins
![Pins](assets/steps/01-pins.png)

---

## Arcs
![Arcs](assets/steps/02-arcs.png)

---

## Cells
![Cells](assets/steps/03-cells.png)

---

## Graph
![Graph](assets/steps/04-graph.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
- Open **graph-build**
- Run Graph / Levelize / Propagate / Slack / Bind, then Check

---

## Implement track
- From common/, run algo_solvers.py and partc_bind.py

---

## Pitfalls
- Changing tiny_algo_sta without updating Part B liberty delays
- Ignoring the bind side

---

## Try these
- From the common folder, run the Part C self-tests

---

## Try these — try these

```
cd courses/learn_opensta/common
python3 algo_solvers.py
python3 partc_bind.py
```

---

## Pseudocode
- Here is the check in plain steps

---

## Pseudocode — try these

```
5 pins, 4 arcs; cells u1/u2/u3.
ok if goldens match and bind
```

---

## Next
- Complete the quiz for this part
- Continue Part C, then wrap , internals literacy is next

