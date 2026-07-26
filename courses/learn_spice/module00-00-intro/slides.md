---
marp: true
title: Welcome
paginate: true
---

# Welcome

After PEX you need a circuit engine , MNA, Newton, LU, transient

---

## The idea
- Toy tiny_spice: voltage divider V2=3; RC transient; diode 1-D Newton

---

## Two tracks
- Implement track uses common/ solvers; browser lab track uses platform tools

---

## Toy netlist
- Vin=5 V divider; R1=2, R2=3, Cload=1, Dprot , V2=3 DC; RC transient; diode Newton

---

## Path
- Netlist → MNA → DC → sparse LU → Newton → callbacks → BE transient → engine

---

## Begin
- Next: netlist nodes and ground

