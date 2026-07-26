# Charge accumulation

**Module id:** module02-03-charge-accumulation
**Lab:** charge-accumulation
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Charge

Plasma etch charge scales with exposed metal — toy uses Q=k×metal.

## Slide 2 — The idea

GOLDEN: charge_n1=25.

<!-- algorithm-walkthrough -->

## Slide 3 — Charge k

![Charge k](assets/steps/01-k.png)

Q = k × metal_area; k=1 on toy.

## Slide 4 — n1 Q

![n1 Q](assets/steps/02-n1q.png)

n1 metal 25 → Q=25.

## Slide 5 — n2 Q

![n2 Q](assets/steps/03-n2q.png)

n2 Q=8.

## Slide 6 — n3 Q

![n3 Q](assets/steps/04-n3q.png)

n3 Q=45.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: charge_n1=25.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **charge-accumulation**. Confirm Q on n1=25.

## Slide 9 — Implement track

Call charge_by_net(); assert charge['n1']==25.

## Slide 10 — Pitfalls

Using ratio instead of metal for Q. Wrong k constant.

## Slide 11 — Your turn

Next: threshold rules.
