# Leakage power

**Module id:** module01-03-leakage-power
**Lab:** leakage-power
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why leakage

Static leakage current times supply voltage gives Pleak.

## Slide 2 — The idea

GOLDEN: plk_n1=0.1.

<!-- algorithm-walkthrough -->

## Slide 3 — Pleak formula

![Pleak formula](assets/steps/01-formula.png)

Pleak = Ileak · V per net.

## Slide 4 — Net n1

![Net n1](assets/steps/02-n1.png)

n1: Ileak=0.1, V=1 → Pleak=0.1.

## Slide 5 — Net n2

![Net n2](assets/steps/03-n2.png)

n2: Ileak=0.05 → Pleak=0.05.

## Slide 6 — Net n3

![Net n3](assets/steps/04-n3.png)

n3: Ileak=0.2 → Pleak=0.2.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: plk_n1=0.1; chip_plk=0.35.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **leakage-power**. Confirm n1 Pleak=0.1.

## Slide 9 — Implement track

Call leakage_power(); assert by_net['n1']==0.1.

## Slide 10 — Pitfalls

Mixing Ileak with switching alpha. Wrong voltage.

## Slide 11 — Your turn

Next: total power.
