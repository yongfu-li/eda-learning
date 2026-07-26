# Switching power

**Module id:** module01-01-switching-power
**Lab:** switching-power
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why switching

Dynamic power scales with activity, cap, voltage squared, and frequency.

## Slide 2 — The idea

GOLDEN: psw_n1=1.0.

<!-- algorithm-walkthrough -->

## Slide 3 — Psw formula

![Psw formula](assets/steps/01-formula.png)

Psw = α · C · V² · f per net.

## Slide 4 — Net n1

![Net n1](assets/steps/02-n1.png)

n1: α=0.5, C=2, V=1, f=1 → Psw=1.0.

## Slide 5 — Net n2

![Net n2](assets/steps/03-n2.png)

n2: α=0.2, C=1 → Psw=0.2.

## Slide 6 — Net n3

![Net n3](assets/steps/04-n3.png)

n3: α=1.0, C=4 → Psw=4.0.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: psw_n1=1.0; chip_psw=5.2.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **switching-power**. Inspect tiny_power; confirm n1 Psw=1.0.

## Slide 9 — Implement track

Call switching_power(); assert by_net['n1']==1.0.

## Slide 10 — Pitfalls

Forgetting V². Using leakage instead of switching.

## Slide 11 — Your turn

Next: leakage power.
