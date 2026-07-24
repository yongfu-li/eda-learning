# Tapping / branch points

**Module id:** module02-07-tapping-points
**Lab:** tapping-points
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Tapping / branch points

Buffers and clock gates often sit where the tree forks.

## Slide 2 — The idea

Collect steiner and edge endpoints. Keep points with degree at least three—those are tapping points.

<!-- algorithm-walkthrough -->

## Slide 3 — Branch taps

![Branch taps](assets/steps/01-def.png)

Tapping points are steiners with degree ≥ 3 — where the clock forks.

## Slide 4 — On MMM

![On MMM](assets/steps/02-mmm.png)

MMM merge points are natural taps.

## Slide 5 — On H-tree

![On H-tree](assets/steps/03-h.png)

H splits also create high-degree junctions.

## Slide 6 — Why care

![Why care](assets/steps/04-why.png)

Buffers and gating often sit at taps; routing capacity concentrates there.

## Slide 7 — API

![API](assets/steps/05-api.png)

Call tappingPoints(tree) after Build — challenges score tap count.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **tapping-points**. Build MMM and confirm taps ≥ 1. Rebuild H-tree and compare tap count.

## Slide 9 — Implement track

Call `tapping_points(tree)` after `mmm_tree`. Assert length ≥ 1 on tiny_cts.

## Slide 10 — Pitfalls

Counting leaf sinks as taps. Using degree on undirected edges inconsistently. Dropping steiners before the degree pass.

## Slide 11 — Your turn

Next: insert buffers on long wires.
