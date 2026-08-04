# STA C++ model

**Module id:** module14-01-sta-cpp-model
**Lab:** sta-cpp-model
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why STA C++

Browser IR and JSON are maps. Real OpenSTA stores the same ideas as C++ objects.

## Slide 2 — The idea

GOLDEN: Network, Graph, Sdc, Search — Search drives arrivals and path reports.

<!-- algorithm-walkthrough -->

## Slide 3 — Network

![Network](assets/steps/01-network.png)

Network holds pins, nets, and instances.

## Slide 4 — Graph

![Graph](assets/steps/02-graph.png)

Graph is the timing vertex/edge view of the netlist.

## Slide 5 — Sdc

![Sdc](assets/steps/03-sdc.png)

Sdc stores clocks and timing constraints.

## Slide 6 — Search

![Search](assets/steps/04-search.png)

Search propagates arrivals and finds paths for reports.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: four pillars — Network, Graph, Sdc, Search.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

Open **sta-cpp-model**. Click through the four pillars and check the goldens.

## Slide 9 — Implement track

Call sta_cpp_model() in internals_solvers; assert pillar count and nesting.

## Slide 10 — Pitfalls

Treating JSON keys as the C++ API. Confusing Graph with physical Magick layout.

## Slide 11 — Try these

From the common folder, run the internals solvers self-test.

```bash
cd courses/learn_opensta/common
python3 internals_solvers.py
```

## Slide 12 — Pseudocode

Here is the OpenSTA nesting in plain steps.

```text
Network → pins/nets/instances
Graph → vertices/edges from Network
Sdc → clocks/constraints
Search → arrivals + FindPath for reports
```

## Slide 13 — Next

Next: read the FindPath to report_checks shape in the OpenSTA tree.
