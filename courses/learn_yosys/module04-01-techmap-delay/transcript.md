# Techmap delay

**Module id:** module04-01-techmap-delay
**Lab:** techmap-delay
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why delay map

Delay-oriented techmap adds buffer NAND for timing literacy.

## Slide 2 — The idea

GOLDEN: techmap_nand_count_delay=7.

<!-- algorithm-walkthrough -->

## Slide 3 — Extra buffer NAND

![Extra buffer NAND](assets/steps/01-extra.png)

Delay mode adds buffer NAND on NOR path.

## Slide 4 — NOR five NAND

![NOR five NAND](assets/steps/02-nor5.png)

NOR path uses five NAND vs four in area.

## Slide 5 — Total NAND

![Total NAND](assets/steps/03-total.png)

Seven NAND2 cells in delay mapping.

## Slide 6 — Area vs delay

![Area vs delay](assets/steps/04-trade.png)

Compare nand=6 area vs nand=7 delay.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: techmap_nand_count_delay=7.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **techmap-delay**. Confirm nand_count=7.

## Slide 9 — Implement track

Call pass_techmap(mode='delay'); assert nand_count==7.

## Slide 10 — Pitfalls

Expecting same count as area. Ignoring DFF passthrough.

## Slide 11 — Your turn

Next: synth script.
