# Power grid

**Module id:** module03-01-power-grid
**Lab:** power-grid
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why grid

IR analysis starts from a resistive grid and sink current.

## Slide 2 — The idea

GOLDEN: 4 nodes, 3 series edges.

<!-- algorithm-walkthrough -->

## Slide 3 — Series path

![Series path](assets/steps/01-path.png)

Grid src→a→b→sink with 3 series edges.

## Slide 4 — Edge e1

![Edge e1](assets/steps/02-e1.png)

e1: src→a, R=1.

## Slide 5 — Edge e2

![Edge e2](assets/steps/03-e2.png)

e2: a→b, R=2.

## Slide 6 — Edge e3

![Edge e3](assets/steps/04-e3.png)

e3: b→sink, R=1.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: 4 nodes, 3 edges series.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **power-grid**. Confirm 4 nodes and 3 edges.

## Slide 9 — Implement track

Call build_power_grid(); assert edge_count==3.

## Slide 10 — Pitfalls

Treating grid as parallel. Wrong node order.

## Slide 11 — Your turn

Next: IR drop.
