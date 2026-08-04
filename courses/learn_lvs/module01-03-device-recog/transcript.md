# Device recognition

**Module id:** module01-03-device-recog
**Lab:** device-recog
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Device recog

Device recognition maps layout shapes to MOS instances — nmos vs pmos.

## Slide 2 — The idea

GOLDEN: nmos=1 pmos=1 (X0/X1).

<!-- algorithm-walkthrough -->

## Slide 3 — Shapes

![Shapes](assets/steps/01-shapes.png)

Nine layout shapes: diff, poly, M1, implants.

## Slide 4 — X0

![X0](assets/steps/02-x0.png)

X0 nmos from ndiff, poly, nplus.

## Slide 5 — X1

![X1](assets/steps/03-x1.png)

X1 pmos from pdiff, poly, pplus.

## Slide 6 — Types

![Types](assets/steps/04-types.png)

Classify each layout device by type.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: nmos=1, pmos=1.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **device-recog**. Select X0 and X1; confirm nmos/pmos counts.

## Slide 9 — Implement track

Call recognize_devices(); assert nmos==1 and pmos==1.

## Slide 10 — Pitfalls

Counting shapes instead of devices. Swapping nmos/pmos polarity.

## Slide 11 — Your turn

Next: net extraction.
