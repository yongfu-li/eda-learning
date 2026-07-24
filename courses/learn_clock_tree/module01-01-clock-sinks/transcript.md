# Clock sinks from placement

**Module id:** module01-01-clock-sinks
**Lab:** clock-sinks
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Clock sinks from placement

Every CTS algorithm starts from sinks—cell centers that must receive the clock—and one source.

## Slide 2 — The idea

sink_points reads placement for A through F. Source sits at six comma four. Moving a sink moves its access point for the next tree build.

<!-- algorithm-walkthrough -->

## Slide 3 — 12×8 chip

![12×8 chip](assets/steps/01-chip.png)

Six sinks A–F sit on the same spread placement as routing labs.

## Slide 4 — Clock source

![Clock source](assets/steps/02-src.png)

CLK star at chip center (6,4) — the root of every tree.

## Slide 5 — Sink A

![Sink A](assets/steps/03-a.png)

A at (1,1) southwest corner.

## Slide 6 — Sink D

![Sink D](assets/steps/04-d.png)

D at (8,5) northeast.

## Slide 7 — All six

![All six](assets/steps/05-all.png)

E/F sit near the center corridor beside the source.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **clock-sinks**. Confirm six sinks and the yellow CLK star at six comma four. Move B and watch its label follow.

## Slide 9 — Implement track

Call `sink_points(placement, sinks)` in `common/ctsutil.py`. Print A through F on tiny_cts. Assert source at (6,4).

## Slide 10 — Pitfalls

Using GCell indices instead of cell centers. Forgetting the source is fixed. Treating nets as sinks.

## Slide 11 — Your turn

Next: measure latency and skew on a built tree.
