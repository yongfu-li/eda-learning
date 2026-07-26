# Total power

**Module id:** module02-01-total-power
**Lab:** total-power
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why total

Signoff reports chip Ptot = sum of switching and leakage.

## Slide 2 — The idea

GOLDEN: chip_ptot=5.55.

<!-- algorithm-walkthrough -->

## Slide 3 — Chip Ptot

![Chip Ptot](assets/steps/01-sum.png)

Ptot = Psw + Pleak per net; sum for chip.

## Slide 4 — Net n1

![Net n1](assets/steps/02-n1.png)

n1: 1.0 + 0.1 = 1.1.

## Slide 5 — Chip Psw

![Chip Psw](assets/steps/03-chip_sw.png)

Chip switching total 5.2.

## Slide 6 — Chip Pleak

![Chip Pleak](assets/steps/04-chip_lk.png)

Chip leakage total 0.35.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: chip_ptot=5.55.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **total-power**. Confirm chip Ptot=5.55.

## Slide 9 — Implement track

Call total_power(); assert total==5.55.

## Slide 10 — Pitfalls

Summing only one component. Double-counting nets.

## Slide 11 — Your turn

Next: activity factors.
