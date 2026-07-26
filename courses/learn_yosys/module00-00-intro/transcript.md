# Welcome to Yosys (toy + real)

**Module id:** module00-00-intro

## Slide 1 — Welcome

learn_yosys has two parts: Part A teaches pass *ideas* on a toy netlist; Part B drives **real Yosys** with `.ys` scripts on `tiny_and_or.v`.

## Slide 2 — Part A literacy

Toy tiny_yosys: 6 cells; flatten→1; opt→5; strash→4; rewrite→3; nand 6/7 — names match Yosys passes, but it is not the Yosys binary.

## Slide 3 — Part B real Yosys

Real path: `read_verilog` → `hierarchy` → `proc` → `flatten` → `opt` → `aigmap`/`synth` → `stat`/`write`. Goldens come from Yosys logs.

## Slide 4 — Two tracks

Implement track: `common/solvers.py` (toy) and `common/real_solvers.py` (evidence). Browser labs mirror both.

## Slide 5 — RTLIL

Yosys IR is RTLIL — `$and`, `$dff`, later `$_AOI3_` / `$_DFF_P_` after synth. You will read `stat` and `dump`.

## Slide 6 — Begin

Start with the toy proc lab for pass names, then continue into the real CLI modules.
