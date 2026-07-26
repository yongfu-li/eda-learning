# Techmap area

**Module id:** module03-03-techmap-area
**Lab:** techmap-area
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why area map

techmap maps AND/NOR to a NAND2 library minimizing cell count.

## Slide 2 — The idea

GOLDEN: techmap_nand_count_area=6.

<!-- algorithm-walkthrough -->

## Slide 3 — NAND2 library

![NAND2 library](assets/steps/01-lib.png)

Map AND/NOR to NAND2 cells.

## Slide 4 — AND → 2 NAND

![AND → 2 NAND](assets/steps/02-and.png)

Each AND uses two NAND (inverter trick).

## Slide 5 — NOR → 4 NAND

![NOR → 4 NAND](assets/steps/03-nor.png)

NOR mapped with four NAND in area mode.

## Slide 6 — NAND count

![NAND count](assets/steps/04-count.png)

Count pure NAND2 instances.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: techmap_nand_count_area=6.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **techmap-area**. Confirm nand_count=6.

## Slide 9 — Implement track

Call pass_techmap(mode='area'); assert nand_count==6.

## Slide 10 — Pitfalls

Counting DFF as NAND. Using delay mapping.

## Slide 11 — Your turn

Next: techmap delay.
