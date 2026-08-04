# PEX engine pass

**Module id:** module04-01-pex-engine
**Lab:** pex-engine
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Engine

A tiny engine chains every PEX stage and reports ok when goldens match.

## Slide 2 — The idea

GOLDEN: ok=True.

<!-- algorithm-walkthrough -->

## Slide 3 — Geo

![Geo](assets/steps/01-geo.png)

Geometry segment_count=4, layer_count=3.

## Slide 4 — R/C

![R/C](assets/steps/02-rc.png)

Resistance r_total=3.06; capacitance c_total=1.376.

## Slide 5 — Reduce

![Reduce](assets/steps/03-reduce.png)

Reduce after_nodes=2; R_eq/C_eq match.

## Slide 6 — SPEF

![SPEF](assets/steps/04-spef.png)

SPEF res_count=1, cap_count=1.

## Slide 7 — OK

![OK](assets/steps/05-ok.png)

GOLDEN: ok=True.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **pex-engine**. Run engine; confirm ok.

## Slide 9 — Implement track

Call pex_engine(); assert ok is True.

## Slide 10 — Pitfalls

Reporting partial stages. Changing toy without updating goldens.

## Slide 11 — Your turn

Next: offline compare, then wrap.
