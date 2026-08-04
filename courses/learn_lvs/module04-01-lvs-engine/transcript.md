# LVS engine pass

**Module id:** module04-01-lvs-engine
**Lab:** lvs-engine
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Engine

A tiny engine chains every LVS stage and reports ok when goldens match.

## Slide 2 — The idea

GOLDEN: ok=True.

<!-- algorithm-walkthrough -->

## Slide 3 — Sch

![Sch](assets/steps/01-sch.png)

Schematic graph device_count=2, net_count=4.

## Slide 4 — Recog

![Recog](assets/steps/02-recog.png)

Recognize nmos=1, pmos=1.

## Slide 5 — Extract

![Extract](assets/steps/03-extract.png)

Extract 4 layout nets.

## Slide 6 — Compare

![Compare](assets/steps/04-compare.png)

Compare mismatch_count=0, matched_nets=4.

## Slide 7 — OK

![OK](assets/steps/05-ok.png)

GOLDEN: ok=True.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **lvs-engine**. Run engine; confirm ok.

## Slide 9 — Implement track

Call lvs_engine(); assert ok is True.

## Slide 10 — Pitfalls

Reporting partial stages. Changing toy without updating goldens.

## Slide 11 — Your turn

Next: offline compare, then wrap.
