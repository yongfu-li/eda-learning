# MNA stamping (R and V)

**Module id:** module01-03-mna-stamps
**Lab:** mna-stamps
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why MNA

Modified nodal analysis builds G and b by stamping each element into a shared matrix.

## Slide 2 — The idea

GOLDEN: mna size 3 — unknowns v1, v2, branch current i_Vin.

<!-- algorithm-walkthrough -->

## Slide 3 — Stamp R

![Stamp R](assets/steps/01-r.png)

Conductance 1/R into G.

## Slide 4 — Stamp V

![Stamp V](assets/steps/02-v.png)

Voltage source adds branch current unknown.

## Slide 5 — Matrix G

![Matrix G](assets/steps/03-g.png)

Build dense G for the toy.

## Slide 6 — RHS b

![RHS b](assets/steps/04-b.png)

RHS holds source values.

## Slide 7 — Size 3

![Size 3](assets/steps/05-sz.png)

GOLDEN MNA size=3.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **mna-stamps**. Build MNA; confirm matrix size 3.

## Slide 9 — Implement track

Call build_mna_linear_dc(); assert size==3.

## Slide 10 — Pitfalls

Forgetting voltage-source branch currents. Stamping C or D in linear DC MNA.

## Slide 11 — Your turn

Next: solve linear DC for V2=3.
