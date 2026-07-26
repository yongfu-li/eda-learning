# Welcome to Yosys

**Module id:** module00-00-intro
**Lab:** intro
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why Yosys

learn_yosys has four parts: Part A is the interactive pass map; Part B drives real Yosys on tiny_and_or.v; Part C teaches algorithms bound to real evidence; Part D orients you to the Yosys C++ tree so you can contribute.

## Slide 2 — Part A pass map

Pass map on tiny_yosys: 6 cells; flatten→1; opt→5; strash→4; rewrite→3; nand 6/7 — same pass names as Yosys, in the browser.

## Slide 3 — Part B real Yosys

Part B: real binary, RTLIL cells, and checked-in goldens from Yosys 0.9 on tiny_and_or.v.

## Slide 4 — Part C algorithms

Part C: proc_mux, proc_dff ($adff), opt, techmap, extract, memory, fsm, and ABC handoff — each bound to real Yosys stats.

## Slide 5 — Part D internals

Part D: RTLIL C++ pillars, Pass registration, reading opt_clean, and a contribute checklist — orientation, not a full Yosys clone.

## Slide 6 — Implement track

Implement track: common/solvers.py, real_solvers.py, algo_solvers.py plus partc_bind.py, and internals_solvers.py. Browser labs mirror each part.

## Slide 7 — Browser lab track

Open the course labs. Start at the pass-map proc lab, continue into CLI, algorithms, then internals.

## Slide 8 — Next

Start with the pass-map proc lab for pass names, then CLI, algorithms, and internals.
