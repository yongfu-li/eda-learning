# Supply shorts

**Module id:** module03-03-supply-shorts
**Lab:** supply-shorts
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why shorts

A hard short between vdd and vss is catastrophic ERC.

## Slide 2 — The idea

GOLDEN: supply_short_count=1 via short1.

<!-- algorithm-walkthrough -->

## Slide 3 — SHORT cell

![SHORT cell](assets/steps/01-short.png)

short1 is a SHORT instance.

## Slide 4 — Pins

![Pins](assets/steps/02-pins.png)

P1→vdd, P2→vss.

## Slide 5 — Kinds

![Kinds](assets/steps/03-kinds.png)

power and ground both present.

## Slide 6 — Flag

![Flag](assets/steps/04-flag.png)

Record the short hit.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: supply_short_count=1.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **supply-shorts**. Confirm short1 bridges vdd↔vss.

## Slide 9 — Implement track

Call find_supply_shorts(); assert count==1.

## Slide 10 — Pitfalls

Treating normal INV VDD/VSS as a short. Missing SHORT cell type.

## Slide 11 — Your turn

Next: well/substrate ties.
