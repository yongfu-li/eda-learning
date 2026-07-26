# Antenna engine integration

**Module id:** module05-01-antenna-engine
**Lab:** antenna-engine
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Engine

A tiny engine chains area, ratio, charge, violations, jumper, markers.

## Slide 2 — The idea

GOLDEN: ratios, violations=1, markers=1, jumper n1=0, ok=True.

<!-- algorithm-walkthrough -->

## Slide 3 — Stats

![Stats](assets/steps/01-stats.png)

3 gates, 4 metals, 3 nets.

## Slide 4 — Ratios

![Ratios](assets/steps/02-ratios.png)

n1=25, n2=4, n3=45.

## Slide 5 — Violations

![Violations](assets/steps/03-viol.png)

After diode: 1 violation on n1.

## Slide 6 — Jumper

![Jumper](assets/steps/04-jmp.png)

Jumper demo: n1 ratio → 0.

## Slide 7 — OK

![OK](assets/steps/05-ok.png)

GOLDEN: engine ok=True.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **antenna-engine**. Run engine; confirm ok.

## Slide 9 — Implement track

Call antenna_engine(); assert ok and markers.count==1.

## Slide 10 — Pitfalls

Reporting partial checks. Changing toy without updating goldens.

## Slide 11 — Your turn

Next: offline compare, then wrap.
