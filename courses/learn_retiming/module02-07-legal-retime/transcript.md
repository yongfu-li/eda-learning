# Legal retiming

**Module id:** module02-07-legal-retime
**Lab:** legal-retime
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Legal

A retiming lag assignment r is legal only if every edge keeps a non-negative register count.

## Slide 2 — The idea

Check w_r = w + r(dst) − r(src) for e0…e4; one negative edge breaks legality.

<!-- algorithm-walkthrough -->

## Slide 3 — All w_r ≥ 0

![All w_r ≥ 0](assets/steps/01-rule.png)

A retiming is legal iff every edge keeps non-negative weight.

## Slide 4 — Zero is legal

![Zero is legal](assets/steps/02-zero.png)

r≡0 is always legal on the starter.

## Slide 5 — Forward a legal

![Forward a legal](assets/steps/03-fwd.png)

Forward on a stays legal and improves period.

## Slide 6 — Backward c illegal

![Backward c illegal](assets/steps/04-bwd.png)

Backward on c alone violates e3.

## Slide 7 — Always check

![Always check](assets/steps/05-check.png)

Before trusting period, assert legality.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **legal-retime**. Toggle moves; green only when is_legal is true.

## Slide 9 — Implement track

Test is_legal after forward on a (True) and backward on c (False).

## Slide 10 — Pitfalls

Checking only one edge. Allowing fractional or negative w in the UI.

## Slide 11 — Your turn

Next: period bound / FEAS lite.
