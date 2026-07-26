# Signoff engine integration

**Module id:** module05-01-signoff-engine
**Lab:** signoff-engine
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Engine

A tiny engine chains corners, checks, ECO, tapeout, and markers.

## Slide 2 — The idea

GOLDEN: corners=3, fails=2, ecos=2, markers=2, ok=True.

<!-- algorithm-walkthrough -->

## Slide 3 — Design stats

![Design stats](assets/steps/01-stats.png)

3 corners, 6 checks, 2 ECOs in toy.

## Slide 4 — Corner pick

![Corner pick](assets/steps/02-corner.png)

Signoff corner ss_0p9_125 derate 1.1.

## Slide 5 — Check fails

![Check fails](assets/steps/03-checks.png)

Two fails before ECO; tapeout blocked.

## Slide 6 — ECO + tapeout

![ECO + tapeout](assets/steps/04-eco.png)

ECOs fix all; tapeout ready after.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: engine ok=True.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **signoff-engine**. Run engine; confirm ok.

## Slide 9 — Implement track

Call signoff_engine(); assert ok and markers.count==2.

## Slide 10 — Pitfalls

Reporting partial checks. Changing toy without updating goldens.

## Slide 11 — Your turn

Next: offline compare, then wrap.
