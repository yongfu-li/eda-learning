# Metal area per net

**Module id:** module01-01-metal-area
**Lab:** metal-area
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Metal area

Antenna checks start by summing metal area on each net.

## Slide 2 — The idea

GOLDEN: metal_area n1=25.

<!-- algorithm-walkthrough -->

## Slide 3 — Sum metal

![Sum metal](assets/steps/01-sum.png)

Sum metal area per net from layer shapes.

## Slide 4 — Net n1

![Net n1](assets/steps/02-n1.png)

n1 has one layer-2 metal m1 area 25.

## Slide 5 — Net n2

![Net n2](assets/steps/03-n2.png)

n2 metal m2 area 8.

## Slide 6 — Net n3

![Net n3](assets/steps/04-n3.png)

n3 metals m3+m3b sum to 45.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: metal_area n1=25.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **metal-area**. Inspect tiny_antenna; confirm n1 metal=25.

## Slide 9 — Implement track

Call metal_area_by_net(); assert area['n1']==25.

## Slide 10 — Pitfalls

Double-counting after jumper cap. Ignoring layer filter.

## Slide 11 — Your turn

Next: gate area per net.
