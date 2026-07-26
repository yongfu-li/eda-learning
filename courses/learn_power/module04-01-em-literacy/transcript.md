# EM literacy

**Module id:** module04-01-em-literacy
**Lab:** em-literacy
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why EM

Electromigration limits peak current per grid edge.

## Slide 2 — The idea

GOLDEN: em_violation_count=3.

<!-- algorithm-walkthrough -->

## Slide 3 — Current limit

![Current limit](assets/steps/01-limit.png)

em_limit=0.08 A per edge.

## Slide 4 — Grid current

![Grid current](assets/steps/02-i.png)

i_sink=0.1 exceeds limit on all edges.

## Slide 5 — Edge e1

![Edge e1](assets/steps/03-e1.png)

e1: 0.1 > 0.08 — EM violation.

## Slide 6 — Edges e2 e3

![Edges e2 e3](assets/steps/04-e23.png)

e2 and e3 also violate.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: em_violation_count=3.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **em-literacy**. Confirm 3 EM violations.

## Slide 9 — Implement track

Call find_em_violations(); assert count==3.

## Slide 10 — Pitfalls

Checking IR instead of per-edge I. Wrong limit units.

## Slide 11 — Your turn

Next: power markers.
