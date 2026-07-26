# Welcome to Yosys

**Module id:** module00-00-intro
**Lab:** intro
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why Yosys

learn_yosys has three parts: Part A is the interactive pass map on a small netlist; Part B drives real Yosys with .ys scripts on tiny_and_or.v; Part C teaches Yosys algorithms bound to real evidence.

## Slide 2 — Part A pass map

Pass map on tiny_yosys: 6 cells; flatten→1; opt→5; strash→4; rewrite→3; nand 6/7 — same pass names as Yosys, in the browser.

## Slide 3 — Part B real Yosys

Part B: real binary, RTLIL cells, and checked-in goldens from Yosys 0.9 on tiny_and_or.v.

## Slide 4 — Part C algorithms

Part C: proc_mux, proc_dff ($adff), opt, techmap, extract, memory, fsm, and ABC handoff — each bound to real Yosys stats.

## Slide 5 — Implement track

Implement track: common/solvers.py (pass map), common/real_solvers.py (evidence), and common/algo_solvers.py plus partc_bind.py (algorithms). Browser labs mirror all three.

## Slide 6 — Browser lab track

Open the course labs. Start at the pass-map proc lab, continue into the real CLI modules, then the Part C algorithm labs.

## Slide 7 — Next

Start with the pass-map proc lab for pass names, continue into the real CLI modules, then the Part C algorithm labs.
