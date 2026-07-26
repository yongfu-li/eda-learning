# Bipartite check (DP feasibility)

**Module id:** module01-05-bipartite-check
**Lab:** bipartite-check
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — DP feasibility

A subgraph that is bipartite can still be double-patterned even when the full chip is not.

## Slide 2 — The idea

GOLDEN: path_lele ok=True on nodes D, E, F.

<!-- algorithm-walkthrough -->

## Slide 3 — Subgraph

![Subgraph](assets/steps/01-sub.png)

Restrict to D–E–F.

## Slide 4 — BFS color

![BFS color](assets/steps/02-bfs.png)

2-color BFS on the path.

## Slide 5 — Path DEF

![Path DEF](assets/steps/03-def.png)

Path has no odd cycle.

## Slide 6 — Colors 0/1

![Colors 0/1](assets/steps/04-cols.png)

Alternate colors along the path.

## Slide 7 — OK

![OK](assets/steps/05-ok.png)

GOLDEN: path_lele ok=True.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **bipartite-check**. Run path check; confirm ok=True for D-E-F.

## Slide 9 — Implement track

Call path_lele(); assert ok is True.

## Slide 10 — Pitfalls

Testing full graph when the lesson is subgraph feasibility. Confusing LELE with SADP.

## Slide 11 — Your turn

Next: SADP mandrel assignment.
