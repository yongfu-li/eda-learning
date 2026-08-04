---
marp: true
title: Why STA C++
paginate: true
---

# Why STA C++

Browser IR and JSON are maps

---

## The idea
- GOLDEN: Network, Graph, Sdc, Search , Search drives arrivals and path reports

---

## Network
![Network](assets/steps/01-network.png)

---

## Graph
![Graph](assets/steps/02-graph.png)

---

## Sdc
![Sdc](assets/steps/03-sdc.png)

---

## Search
![Search](assets/steps/04-search.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
- Open **sta-cpp-model**
- Click through the four pillars and check the goldens

---

## Implement track
- Call sta_cpp_model() in internals_solvers; assert pillar count and nesting

---

## Pitfalls
- Treating JSON keys as the C++ API
- Confusing Graph with physical Magick layout

---

## Try these
- From the common folder, run the internals solvers self-test

---

## Try these — try these

```
cd courses/learn_opensta/common
python3 internals_solvers.py
```

---

## Pseudocode
- Here is the OpenSTA nesting in plain steps

---

## Pseudocode — try these

```
Network → pins/nets/instances
Graph → vertices/edges from Network
Sdc → clocks/constraints
Search → arrivals + FindPath for reports
```

---

## Next
- Complete the quiz for this part
- Next: read the FindPath to report_checks shape in the OpenSTA tree

