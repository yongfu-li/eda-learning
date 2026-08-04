# DRC engine pass

**Module id:** module04-01-drc-engine
**Lab:** drc-engine
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Engine

A tiny engine chains every checker and reports ok when goldens match.

## Slide 2 — The idea

GOLDEN: ok=True viol=3.

<!-- algorithm-walkthrough -->

## Slide 3 — Deck

![Deck](assets/steps/01-deck.png)

Load deck rule_count=8.

## Slide 4 — Checks

![Checks](assets/steps/02-checks.png)

Run width, space, and enclosure checkers.

## Slide 5 — Viol

![Viol](assets/steps/03-viol.png)

Collect geometry violations count=3.

## Slide 6 — Bool

![Bool](assets/steps/04-bool.png)

Boolean hit=1 on V (separate from viol count).

## Slide 7 — OK

![OK](assets/steps/05-ok.png)

GOLDEN: ok=True viol=3.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **drc-engine**. Run engine; confirm ok.

## Slide 9 — Implement track

Call drc_engine(); assert ok and violations.count==3.

## Slide 10 — Pitfalls

Reporting partial checks. Changing the toy without updating goldens.

## Slide 11 — Your turn

Next: offline compare, then wrap.
