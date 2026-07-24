# Cell library for mapping

**Module id:** module02-07-library-cells
**Lab:** library-cells
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Library

Techmapping chooses library cells that cover AIG cuts.

## Slide 2 — The idea

Six cells: area and delay costs; INV for complemented edges.

<!-- algorithm-walkthrough -->

## Slide 3 — Six cells

![Six cells](assets/steps/01-six.png)

Library size is six.

## Slide 4 — AND2

![AND2](assets/steps/02-and2.png)

AND2 area=2 delay=2.

## Slide 5 — NOR2

![NOR2](assets/steps/03-nor2.png)

NOR2 covers AND(~,~).

## Slide 6 — INV

![INV](assets/steps/04-inv.png)

INV area=1 for edge bubbles.

## Slide 7 — AOI21

![AOI21](assets/steps/05-aoi.png)

AOI21 is available for richer covers (toy).

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **library-cells**. Confirm six cells; run techmap and see cell ids.

## Slide 9 — Implement track

Print data['library']; assert len==6.

## Slide 10 — Pitfalls

Ignoring area when comparing. Mapping without INV cost.

## Slide 11 — Your turn

Next: area-oriented techmap cover.
