# SADP lite (mandrels + spacers)

**Module id:** module02-01-double-sadp
**Lab:** double-sadp
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — SADP lite

SADP is not LELE coloring — mandrels print first; spacers form between mandrels.

## Slide 2 — The idea

GOLDEN: mandrel_count=3 (A, D, F on the toy greedy pick).

<!-- algorithm-walkthrough -->

## Slide 3 — Mandrel

![Mandrel](assets/steps/01-man.png)

SADP starts from mandrel features.

## Slide 4 — Spacer

![Spacer](assets/steps/02-sp.png)

Neighbors can be spacer-defined.

## Slide 5 — Independent set

![Independent set](assets/steps/03-ind.png)

Mandrels form an independent set.

## Slide 6 — Assign

![Assign](assets/steps/04-asg.png)

Greedy MIS → mandrels A,D,F.

## Slide 7 — Count 3

![Count 3](assets/steps/05-n.png)

GOLDEN mandrel_count=3.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **double-sadp**. Run SADP assign; confirm mandrel_count=3.

## Slide 9 — Implement track

Call sadp_assign(); assert mandrel_count==3.

## Slide 10 — Pitfalls

Treating SADP as 2-coloring. Expecting same result as LELE.

## Slide 11 — Your turn

Next: stitch to break odd cycles.
