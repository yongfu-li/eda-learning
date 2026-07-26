# Conflict graph construction

**Module id:** module01-01-conflict-graph
**Lab:** conflict-graph
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why conflicts

Multi-patterning starts by finding which features cannot share the same mask.

## Slide 2 — The idea

GOLDEN: 6 nodes, 5 edges (A-B, A-C, B-C, D-E, E-F), min_same_mask=2.

<!-- algorithm-walkthrough -->

## Slide 3 — Features

![Features](assets/steps/01-feat.png)

Six features A–F on the toy.

## Slide 4 — Min space

![Min space](assets/steps/02-min.png)

min_same_mask=2.

## Slide 5 — Edges

![Edges](assets/steps/03-edges.png)

Conflict if gap < 2 → 5 edges.

## Slide 6 — Triangle

![Triangle](assets/steps/04-tri.png)

A–B–C form a triangle.

## Slide 7 — Path

![Path](assets/steps/05-path.png)

D–E–F is a path.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **conflict-graph**. Build graph; confirm 6 nodes and 5 edges.

## Slide 9 — Implement track

Call build_conflict_graph(); assert feature_count==6 and edge_count==5.

## Slide 10 — Pitfalls

Using center distance instead of bbox gap. Forgetting min_same_mask from JSON.

## Slide 11 — Your turn

Next: LELE double patterning as 2-coloring.
