---
marp: true
title: Welcome
paginate: true
---

# Welcome

After SPICE you still need electrical rules , floating gates, multi-drive, supply shorts, wells

---

## The idea
- Toy tiny_erc: INV/BUF/SHORT + bad nwell → 5 ERC markers

---

## Two tracks
- Implement track uses common/ solvers; browser lab track uses platform tools

---

## Toy netlist
- Tiny_erc: u1 INV, u2 INV on float_n, u3 BUF fighting z, short1 vdd↔vss, bad nwell

---

## Path
- Graph → drivers → floating → undriven → multi → shorts → wells → markers → engine

---

## Begin
- Next: netlist connectivity graph

