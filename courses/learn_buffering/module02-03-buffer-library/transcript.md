# Buffer library options

**Module id:** module02-03-buffer-library
**Lab:** buffer-library
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Library

Stronger buffers cost input cap but drive with lower resistance.

## Slide 2 — The idea

BUF_X1, BUF_X2, INV_X1 each publish cin, rout, delay, invert. Van Ginneken tries each non-inverting cell unless polarity mode allows INV.

<!-- algorithm-walkthrough -->

## Slide 3 — Three cells

![Three cells](assets/steps/01-three.png)

Library has BUF_X1, BUF_X2, INV_X1.

## Slide 4 — BUF_X2 stronger

![BUF_X2 stronger](assets/steps/02-x2.png)

BUF_X2: higher cin, lower rout, slightly less intrinsic delay.

## Slide 5 — Inverter

![Inverter](assets/steps/03-inv.png)

INV_X1 flips polarity — used in polarity labs.

## Slide 6 — Pick for DP

![Pick for DP](assets/steps/04-pick.png)

VG options reference library ids on buffered solutions.

## Slide 7 — Area trade

![Area trade](assets/steps/05-area.png)

Real flows also score area; this toy scores delay/slew only.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **buffer-library**. Confirm three cells. Run Van Ginneken and see which buf ids appear.

## Slide 9 — Implement track

Print `data['buffer_library']`. Assert GOLDENS.libCount == 3.

## Slide 10 — Pitfalls

Ignoring invert flag. Treating rout as delay. Using cells not in the library.

## Slide 11 — Your turn

Next: Van Ginneken dynamic programming lite.
