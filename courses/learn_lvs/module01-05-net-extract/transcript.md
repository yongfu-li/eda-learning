# Net extraction

**Module id:** module01-05-net-extract
**Lab:** net-extract
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Net extract

Net extraction groups layout shapes into electrically connected nets.

## Slide 2 — The idea

GOLDEN: 4 layout nets net_a/y/vss/vdd.

<!-- algorithm-walkthrough -->

## Slide 3 — Shapes

![Shapes](assets/steps/01-shapes.png)

M1 and diffusion shapes carry connectivity.

## Slide 4 — net_a

![net_a](assets/steps/02-net_a.png)

net_a: poly + m1_a (gate net a).

## Slide 5 — net_y

![net_y](assets/steps/03-net_y.png)

net_y: m1_y (output y).

## Slide 6 — Supplies

![Supplies](assets/steps/04-sup.png)

net_vss and net_vdd tie diff + M1.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: count=4 nets.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **net-extract**. Select net_a and net_y; confirm 4 layout nets.

## Slide 9 — Implement track

Call extract_nets(); assert count==4 and ids include net_a, net_y.

## Slide 10 — Pitfalls

Splitting a net at a via. Missing port annotation on supplies.

## Slide 11 — Your turn

Next: layout device–net graph.
