# Welcome to SPICE

**Module id:** module00-00-intro

## Slide 1 — Welcome

After PEX you need a circuit engine — MNA, Newton, LU, transient.

## Slide 2 — The idea

Toy tiny_spice: voltage divider V2=3; RC transient; diode 1-D Newton.

## Slide 3 — Two tracks

Implement track uses common/ solvers; browser lab track uses platform tools.

## Slide 4 — Toy netlist

Vin=5 V divider; R1=2, R2=3, Cload=1, Dprot — V2=3 DC; RC transient; diode Newton.

## Slide 5 — Path

Netlist → MNA → DC → sparse LU → Newton → callbacks → BE transient → engine.

## Slide 6 — Begin

Next: netlist nodes and ground.
