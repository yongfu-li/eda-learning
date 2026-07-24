# Area vs delay tradeoff

**Module id:** module03-03-area-delay
**Lab:** area-delay
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Area/delay

Mappers optimize different objectives: area, delay, or a blend.

## Slide 2 — The idea

area_mode reports area + delay_sum; delay_mode reports depth×AND delay.

<!-- algorithm-walkthrough -->

## Slide 3 — Trade

![Trade](assets/steps/01-trade.png)

Two modes share the same cover on this toy.

## Slide 4 — Area mode

![Area mode](assets/steps/02-area.png)

Sum of cell areas (plus INV).

## Slide 5 — Delay mode

![Delay mode](assets/steps/03-delay.png)

Depth proxy = #AND × AND2 delay.

## Slide 6 — Library

![Library](assets/steps/04-lib.png)

Six cells bound the choice set.

## Slide 7 — Choice

![Choice](assets/steps/05-choice.png)

Real flows weight the two; we just report both.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **area-delay**. Run both techmap buttons; compare metrics.

## Slide 9 — Implement track

Call area_delay_tradeoff; print both modes.

## Slide 10 — Pitfalls

Treating delay_sum as critical path blindly. Ignoring depth.

## Slide 11 — Your turn

Next: full sequential synth pass.
