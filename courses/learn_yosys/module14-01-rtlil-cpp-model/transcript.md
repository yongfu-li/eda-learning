# RTLIL C++ model

**Module id:** module14-01-rtlil-cpp-model
**Lab:** rtlil-cpp-model
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why RTLIL C++

Browser IR and JSON are maps. Real Yosys stores the same ideas as C++ objects in RTLIL.

## Slide 2 — The idea

GOLDEN: Design owns Modules; Module owns Wires, Cells, Processes; ports use SigSpec.

<!-- algorithm-walkthrough -->

## Slide 3 — Design

![Design](assets/steps/01-design.png)

Design is the root container for modules.

## Slide 4 — Module

![Module](assets/steps/02-module.png)

Module holds wires, cells, and processes.

## Slide 5 — Wire and Cell

![Wire and Cell](assets/steps/03-wire-cell.png)

Wires are nets; cells are instances with typed ports.

## Slide 6 — SigSpec

![SigSpec](assets/steps/04-sigspec.png)

SigSpec is the bit-accurate connection fabric.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: five pillars — Design, Module, Wire, Cell, SigSpec.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

Open **rtlil-cpp-model**. Click through the object graph and check the goldens.

## Slide 9 — Implement track

Call rtlil_cpp_model() in internals_solvers; assert pillar count and nesting.

## Slide 10 — Pitfalls

Treating JSON keys as the C++ API. Forgetting SigSpec between cells and wires.

## Slide 11 — Try these

From the common folder, run the internals solvers self-test.

```bash
cd courses/learn_yosys/common
python3 internals_solvers.py
```

## Slide 12 — Pseudocode

Here is the RTLIL nesting in plain steps.

```text
design.modules[name] → module
module.wires / module.cells / module.processes
cell.connections[port] → SigSpec
```

## Slide 13 — Next

Next: how passes register and run on a Design.
