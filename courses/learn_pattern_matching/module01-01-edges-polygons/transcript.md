# Edges and polygons

**Module id:** module01-01-edges-polygons
**Lab:** edges-polygons
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why edges

Pattern engines begin with polygons and their edges on named layers.

## Slide 2 — The idea

GOLDEN: 5 shapes, 3 layers, 20 edges (4 per shape), 3 shapes on M1.

<!-- algorithm-walkthrough -->

## Slide 3 — Shapes

![Shapes](assets/steps/01-shapes.png)

Five rectangles: A,B,D on M1; C on M2; V on VIA.

## Slide 4 — Layers

![Layers](assets/steps/02-layers.png)

Layers M1, M2, VIA — GOLDEN layer_count=3.

## Slide 5 — Edges

![Edges](assets/steps/03-edges.png)

Each rect yields 4 edges → 20 total.

## Slide 6 — Select A

![Select A](assets/steps/04-a.png)

A is 8×4 on M1 at left.

## Slide 7 — Stats

![Stats](assets/steps/05-stats.png)

geometry_stats reports counts and widths.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **edges-polygons**. Select shapes; confirm shape_count=5 and edge_count=20.

## Slide 9 — Implement track

Call geometry_stats(); assert shape_count==5 and edge_count==20.

## Slide 10 — Pitfalls

Counting only cells. Mixing chip size with shape count.

## Slide 11 — Your turn

Next: single-layer edge-pair spacing.
