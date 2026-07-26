# Floating nets

**Module id:** module02-01-floating-nets
**Lab:** floating-nets
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why floating

A floating net has loads but no driver — classic ERC fail.

## Slide 2 — The idea

GOLDEN: floating_nets=['float_n'], count=1.

<!-- algorithm-walkthrough -->

## Slide 3 — No driver

![No driver](assets/steps/01-nodrv.png)

float_n has zero output pins.

## Slide 4 — Has load

![Has load](assets/steps/02-load.png)

u2.A loads float_n.

## Slide 5 — Not port

![Not port](assets/steps/03-port.png)

float_n is not a primary port.

## Slide 6 — Not supply

![Not supply](assets/steps/04-sup.png)

float_n is not vdd/vss.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: floating_count=1.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **floating-nets**. Select float_n; run floating check.

## Slide 9 — Implement track

Call find_floating_nets(); assert nets==['float_n'].

## Slide 10 — Pitfalls

Flagging primary inputs as floating. Ignoring unused well nets.

## Slide 11 — Your turn

Next: undriven inputs.
