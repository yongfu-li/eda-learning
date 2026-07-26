# Drivers and loads

**Module id:** module01-03-drivers-loads
**Lab:** drivers-loads
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why drivers

ERC needs drivers and loads — output pins drive; input pins load.

## Slide 2 — The idea

GOLDEN: z has 2 drivers; float_n has 0 drivers and 1 load.

<!-- algorithm-walkthrough -->

## Slide 3 — Out pins

![Out pins](assets/steps/01-out.png)

Y pins are drivers (dir=out).

## Slide 4 — In pins

![In pins](assets/steps/02-in.png)

A pins are loads (dir=in).

## Slide 5 — z drivers

![z drivers](assets/steps/03-z.png)

Net z: u2.Y and u3.Y — two drivers.

## Slide 6 — float

![float](assets/steps/04-float.png)

float_n: zero drivers, one load (u2.A).

## Slide 7 — Count

![Count](assets/steps/05-count.png)

GOLDEN: float_n drivers=0, z drivers=2.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **drivers-loads**. Confirm z has 2 drivers and float_n has 0.

## Slide 9 — Implement track

Call drivers_and_loads(); assert len(by_net['z']['drivers'])==2.

## Slide 10 — Pitfalls

Treating power pins as drivers. Ignoring SHORT io pins.

## Slide 11 — Your turn

Next: floating nets.
