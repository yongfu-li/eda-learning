# Gate area per net

**Module id:** module01-03-gate-area
**Lab:** gate-area
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Gate area

Antenna ratio divides metal area by gate area on the same net.

## Slide 2 — The idea

GOLDEN: gate_area n1=1.

<!-- algorithm-walkthrough -->

## Slide 3 — Gate shapes

![Gate shapes](assets/steps/01-gates.png)

Each gate polygon contributes area on its net.

## Slide 4 — n1 gate

![n1 gate](assets/steps/02-n1g.png)

g1 on n1 area 1.

## Slide 5 — n2 gate

![n2 gate](assets/steps/03-n2g.png)

g2 on n2 area 2.

## Slide 6 — n3 gate

![n3 gate](assets/steps/04-n3g.png)

g3 on n3 area 1.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: gate_area n1=1.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **gate-area**. Confirm n1 gate area=1.

## Slide 9 — Implement track

Call gate_area_by_net(); assert area['n1']==1.

## Slide 10 — Pitfalls

Mixing gate count with gate area. Using wrong net id.

## Slide 11 — Your turn

Next: antenna ratio.
