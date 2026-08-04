# Enclosure checker

**Module id:** module02-01-enclosure-checker
**Lab:** enclosure-checker
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Enclosure

Enclosure rules require VIA (inner) to sit inside metal (outer) by a margin.

## Slide 2 — The idea

GOLDEN: enc=1 V vs M2, E.VIA_M2.

<!-- algorithm-walkthrough -->

## Slide 3 — Rule

![Rule](assets/steps/01-rule.png)

E.VIA_M2: VIA inside M2 by limit 1.

## Slide 4 — VIA

![VIA](assets/steps/02-via.png)

Inner shape V on VIA layer.

## Slide 5 — M2

![M2](assets/steps/03-m2.png)

Outer M2 shape C should enclose V.

## Slide 6 — Margin

![Margin](assets/steps/04-margin.png)

V is not enclosed by M2 — violation.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: enc=1 V vs M2, E.VIA_M2.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **enclosure-checker**. Select V; run enclosure check.

## Slide 9 — Implement track

Call check_enclosure(); assert count==1 and inner=='V'.

## Slide 10 — Pitfalls

Checking M1 enclosure when M2 is the failing outer. Using overlap instead of contains.

## Slide 11 — Your turn

Next: collect violation markers.
