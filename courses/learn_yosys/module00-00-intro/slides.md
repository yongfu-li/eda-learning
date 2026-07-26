---
marp: true
title: Welcome
paginate: true
---

# Welcome

Learn_yosys has two parts

---

## Part A literacy
- Toy tiny_yosys

---

## Part B real Yosys
- Real path: `read_verilog` → `hierarchy` → `proc` → `flatten` → `opt` → `aigmap`/`synth` →
- Goldens come from Yosys logs

---

## Two tracks
- Implement track: `common/solvers.py` (toy) and `common/real_solvers.py` (evidence)
- Browser labs mirror both

---

## RTLIL
- Yosys IR is RTLIL , `$and`, `$dff`, later `$_AOI3_` / `$_DFF_P_` after synth
- You will read `stat` and `dump`

---

## Begin
- Start with the toy proc lab for pass names, then continue into the real CLI modules

