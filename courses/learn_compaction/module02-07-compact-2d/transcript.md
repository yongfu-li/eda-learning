# 2-D compaction

**Module id:** module02-07-compact-2d
**Lab:** compact-2d
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — 2-D compact

2-D compaction usually alternates axes (X then Y on the toy).

## Slide 2 — The idea

GOLDEN: initial 20×6 → final width 14 (height may shift slightly with projections).

<!-- algorithm-walkthrough -->

## Slide 3 — Order

![Order](assets/steps/01-order.png)

Default order is X then Y.

## Slide 4 — X step

![X step](assets/steps/02-xstep.png)

First step shrinks width.

## Slide 5 — Y step

![Y step](assets/steps/03-ystep.png)

Second step rebuilds Y constraints.

## Slide 6 — Final

![Final](assets/steps/04-final.png)

final_width=14 on the toy.

## Slide 7 — Trade

![Trade](assets/steps/05-trade.png)

Axis order can change results in richer layouts.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **compact-2d**. Run 2-D; read final width 14.

## Slide 9 — Implement track

Call compact_2d(DATA); assert final_width==14.

## Slide 10 — Pitfalls

Assuming one axis is enough. Ignoring order sensitivity.

## Slide 11 — Your turn

Next: wire jogs.
