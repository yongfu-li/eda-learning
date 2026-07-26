# PVT corners

**Module id:** module01-01-corners
**Lab:** corners
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why corners

Signoff starts from a small set of process/voltage/temperature corners.

## Slide 2 — The idea

GOLDEN: corner_count=3.

<!-- algorithm-walkthrough -->

## Slide 3 — PVT triple

![PVT triple](assets/steps/01-pvt.png)

Three process/voltage/temperature corners in tiny_signoff.

## Slide 4 — Slow slow

![Slow slow](assets/steps/02-ss.png)

ss_0p9_125: Vdd=0.9, temp=125, derate=1.1.

## Slide 5 — Typical

![Typical](assets/steps/03-tt.png)

tt_1p0_25: nominal Vdd and temp.

## Slide 6 — Fast fast

![Fast fast](assets/steps/04-ff.png)

ff_1p1_m40: fast process, low temp.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: corner_count=3.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **corners**. Inspect tiny_signoff; confirm 3 corners.

## Slide 9 — Implement track

Call list_corners(); assert count==3.

## Slide 10 — Pitfalls

Confusing signoff corner with full MCMM. Missing derate field.

## Slide 11 — Your turn

Next: pick signoff corner.
