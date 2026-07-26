# LELE double patterning

**Module id:** module01-03-double-lele
**Lab:** double-lele
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — LELE overview

LELE double patterning assigns two lithography masks by 2-coloring conflicts.

## Slide 2 — The idea

GOLDEN: lele_double ok=False on the full graph (triangle A-B-C).

<!-- algorithm-walkthrough -->

## Slide 3 — LELE idea

![LELE idea](assets/steps/01-idea.png)

LELE DP = two masks via 2-coloring.

## Slide 4 — Two masks

![Two masks](assets/steps/02-two.png)

Assign color 0/1 to features.

## Slide 5 — Color attempt

![Color attempt](assets/steps/03-try.png)

BFS 2-color the conflict graph.

## Slide 6 — Odd cycle

![Odd cycle](assets/steps/04-odd.png)

Triangle A-B-C is an odd cycle.

## Slide 7 — Fail

![Fail](assets/steps/05-fail.png)

GOLDEN: lele_double ok=False.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **double-lele**. Run LELE; confirm ok=False on tiny_mp.

## Slide 9 — Implement track

Call lele_double(); assert ok is False.

## Slide 10 — Pitfalls

Assuming DP always works. Ignoring odd cycles in the full layout.

## Slide 11 — Your turn

Next: bipartite check on a subgraph.
