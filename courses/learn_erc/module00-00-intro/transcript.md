# Welcome to ERC

**Module id:** module00-00-intro

## Slide 1 — Welcome

After SPICE you still need electrical rules — floating gates, multi-drive, supply shorts, wells.

## Slide 2 — The idea

Toy tiny_erc: INV/BUF/SHORT + bad nwell → 5 ERC markers.

## Slide 3 — Two tracks

Implement track uses common/ solvers; browser lab track uses platform tools.

## Slide 4 — Toy netlist

tiny_erc: u1 INV, u2 INV on float_n, u3 BUF fighting z, short1 vdd↔vss, bad nwell.

## Slide 5 — Path

Graph → drivers → floating → undriven → multi → shorts → wells → markers → engine.

## Slide 6 — Begin

Next: netlist connectivity graph.
