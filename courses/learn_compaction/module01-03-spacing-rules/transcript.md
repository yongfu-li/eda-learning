# Spacing / gap rules

**Module id:** module01-03-spacing-rules
**Lab:** spacing-rules
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Spacing

Design rules demand a minimum gap between adjacent shapes that project on an axis.

## Slide 2 — The idea

min_gap=1 on the toy. Initial layout is legal; illegal if two cells overlap or gap < 1.

<!-- algorithm-walkthrough -->

## Slide 3 — Gap one

![Gap one](assets/steps/01-gap.png)

GOLDEN min_gap = 1.

## Slide 4 — Legal init

![Legal init](assets/steps/02-legal.png)

Starter layout is_legal → True.

## Slide 5 — Overlap fail

![Overlap fail](assets/steps/03-overlap.png)

Overlapping rects fail legality.

## Slide 6 — Project

![Project](assets/steps/04-proj.png)

Spacing applies when orthogonal projections overlap.

## Slide 7 — Why

![Why](assets/steps/05-why.png)

Constraints encode these gaps in the graph next.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **spacing-rules**. Confirm min_gap=1 and legal starter.

## Slide 9 — Implement track

Call is_legal(DATA); assert True. Print min_gap.

## Slide 10 — Pitfalls

Applying gap without projection overlap. Ignoring wires wrongly as cells.

## Slide 11 — Your turn

Next: the constraint graph.
