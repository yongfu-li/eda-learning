# Signoff corner pick

**Module id:** module01-03-signoff-corner
**Lab:** signoff-corner
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why signoff corner

The slow-slow hot corner is the pessimistic signoff PVT for delay.

## Slide 2 — The idea

GOLDEN: signoff_corner=ss_0p9_125, derate=1.1.

<!-- algorithm-walkthrough -->

## Slide 3 — Pick corner

![Pick corner](assets/steps/01-pick.png)

signoff_corner selects the slow-slow signoff PVT.

## Slide 4 — Vdd 0.9

![Vdd 0.9](assets/steps/02-vdd.png)

Lower Vdd at high temp is the pessimistic corner.

## Slide 5 — Temp 125

![Temp 125](assets/steps/03-temp.png)

Hot slow corner for max delay.

## Slide 6 — Derate 1.1

![Derate 1.1](assets/steps/04-derate.png)

Corner derate scales reported delay.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: ss_0p9_125 derate=1.1.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **signoff-corner**. Confirm ss_0p9_125 and derate 1.1.

## Slide 9 — Implement track

Call pick_signoff_corner(); assert id and derate match goldens.

## Slide 10 — Pitfalls

Using tt for signoff. Ignoring derate on ss.

## Slide 11 — Your turn

Next: apply derate.
