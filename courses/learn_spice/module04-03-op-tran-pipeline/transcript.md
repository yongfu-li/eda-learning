# OP then TRAN pipeline

**Module id:** module04-03-op-tran-pipeline
**Lab:** op-tran-pipeline
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why pipeline

Production SPICE runs OP first, initializes storage elements, then steps TRAN.

## Slide 2 — The idea

GOLDEN: OP V2=3.0; TRAN from v2_init=0 → final_v2≈2.255181.

<!-- algorithm-walkthrough -->

## Slide 3 — OP

![OP](assets/steps/01-op.png)

Compute DC operating point.

## Slide 4 — Init C

![Init C](assets/steps/02-init.png)

Start capacitor from 0 for TRAN demo.

## Slide 5 — Step loop

![Step loop](assets/steps/03-loop.png)

Repeat BE steps.

## Slide 6 — Pipeline

![Pipeline](assets/steps/04-pipe.png)

OP then TRAN is the classic flow.

## Slide 7 — Report

![Report](assets/steps/05-rep.png)

Report DC and TRAN endpoints.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **op-tran-pipeline**. Run OP then TRAN; compare v2 at OP vs final.

## Slide 9 — Implement track

Call dc_linear_solve() then transient_be(v2_init=0.0); report both v2 values.

## Slide 10 — Pitfalls

Starting TRAN from OP cap voltage when lab sets v2_init=0. Skipping OP check.

## Slide 11 — Your turn

Next: full spice_engine integration.
