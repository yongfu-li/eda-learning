# Activity factors

**Module id:** module02-03-activity-factors
**Lab:** activity-factors
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why activity

Lower α on quiet nets reduces reported switching power.

## Slide 2 — The idea

GOLDEN: alphas n1=0.5, n2=0.2, n3=1.0.

<!-- algorithm-walkthrough -->

## Slide 3 — Alpha per net

![Alpha per net](assets/steps/01-alpha.png)

Activity α scales switching — read per net.

## Slide 4 — n1 α

![n1 α](assets/steps/02-n1a.png)

n1 α=0.5.

## Slide 5 — n2 α

![n2 α](assets/steps/03-n2a.png)

n2 α=0.2.

## Slide 6 — n3 α

![n3 α](assets/steps/04-n3a.png)

n3 α=1.0 (fully active).

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: alphas n1=0.5, n2=0.2, n3=1.0.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **activity-factors**. Confirm the three alphas.

## Slide 9 — Implement track

Call activity_factors(); assert alphas match goldens.

## Slide 10 — Pitfalls

Confusing α with Ileak. Using mean instead of per-net.

## Slide 11 — Your turn

Next: power grid.
