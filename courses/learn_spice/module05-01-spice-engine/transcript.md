# SPICE engine integration

**Module id:** module05-01-spice-engine
**Lab:** spice-engine
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why engine

A tiny engine chains DC, NR, transient, and diode checks on one netlist.

## Slide 2 — The idea

GOLDEN: dc_v2=3, nr converged, tran final_v2≈2.255181, diode NR ok.

<!-- algorithm-walkthrough -->

## Slide 3 — DC

![DC](assets/steps/01-dc.png)

Linear DC V2=3.

## Slide 4 — NR

![NR](assets/steps/02-nr.png)

NR converges in 1 iter.

## Slide 5 — TRAN

![TRAN](assets/steps/03-tr.png)

BE transient runs.

## Slide 6 — Diode NR

![Diode NR](assets/steps/04-d.png)

1-D diode Newton ok.

## Slide 7 — OK

![OK](assets/steps/05-ok.png)

GOLDEN engine ok.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **spice-engine**. Run engine; confirm all goldens.

## Slide 9 — Implement track

Call spice_engine(); assert ok, dc_v2≈3.0, nr_converged, diode converged.

## Slide 10 — Pitfalls

Reporting partial results. Mixing linear and nonlinear paths inconsistently.

## Slide 11 — Your turn

Next: offline benchmark compare, then wrap.
