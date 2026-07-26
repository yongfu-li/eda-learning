---
marp: true
title: Why RTLIL C++
paginate: true
---

# Why RTLIL C++

Browser IR and JSON are maps

---

## The idea
- GOLDEN: Design owns Modules; Module owns Wires, Cells, Processes; ports use SigSpec

---

## Design
![Design](assets/steps/01-design.png)

---

## Module
![Module](assets/steps/02-module.png)

---

## Wire and Cell
![Wire and Cell](assets/steps/03-wire-cell.png)

---

## SigSpec
![SigSpec](assets/steps/04-sigspec.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
- Open **rtlil-cpp-model**
- Click through the object graph and check the goldens

---

## Implement track
- Call rtlil_cpp_model() in internals_solvers; assert pillar count and nesting

---

## Pitfalls
- Treating JSON keys as the C++ API
- Forgetting SigSpec between cells and wires

---

## Try these
- From the common folder, run the internals solvers self-test

---

## Try these — try these

```
cd courses/learn_yosys/common
python3 internals_solvers.py
```

---

## Pseudocode
- Here is the RTLIL nesting in plain steps

---

## Pseudocode — try these

```
design.modules[name] → module
module.wires / module.cells / module.processes
cell.connections[port] → SigSpec
```

---

## Next
- Complete the quiz for this part
- Next: how passes register and run on a Design

