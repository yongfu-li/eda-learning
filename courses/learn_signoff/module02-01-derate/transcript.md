# Derate formula

**Module id:** module02-01-derate
**Lab:** derate
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why derate

Reported path delay scales by the signoff corner derate.

## Slide 2 — The idea

GOLDEN: derated=1.1 for delay=1.0.

<!-- algorithm-walkthrough -->

## Slide 3 — Delay scale

![Delay scale](assets/steps/01-formula.png)

derated = delay × signoff derate.

## Slide 4 — Input 1.0

![Input 1.0](assets/steps/02-in.png)

Nominal path delay before derate.

## Slide 5 — Derate 1.1

![Derate 1.1](assets/steps/03-rate.png)

Read derate from signoff corner.

## Slide 6 — Result 1.1

![Result 1.1](assets/steps/04-out.png)

1.0 × 1.1 = 1.1 ns derated.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: derated=1.1 for delay=1.0.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **derate**. Run derate on delay=1.0; confirm 1.1.

## Slide 9 — Implement track

Call apply_derate(1.0); assert derated==1.1.

## Slide 10 — Pitfalls

Using wrong corner derate. Forgetting multiply order.

## Slide 11 — Your turn

Next: check suite.
