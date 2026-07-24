# Slew / transition budget

**Module id:** module01-03-slew-budget
**Lab:** slew-budget
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Slew budget

Slew (transition) is what library cells require; long RC violates the budget.

## Slide 2 — The idea

estimate_slew equals k times R times C_total with k about 2.2. slew_ok is true when slew is at most the limit—eight on the toy.

<!-- algorithm-walkthrough -->

## Slide 3 — Slew definition

![Slew definition](assets/steps/01-def.png)

Toy transition ≈ 2.2 · R · C_total on the segment.

## Slide 4 — Limit eight

![Limit eight](assets/steps/02-limit.png)

GOLDENS.slewLimit = 8 on tiny_buf.

## Slide 5 — Hot edge

![Hot edge](assets/steps/03-hot.png)

Long e0 with branch load can approach or exceed the limit.

## Slide 6 — Pass/fail

![Pass/fail](assets/steps/04-ok.png)

slew_ok gates whether slew-driven insertion fires.

## Slide 7 — Toward insert

![Toward insert](assets/steps/05-next.png)

Failing edges get buffer candidates in later labs.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **slew-budget**. Read edge slews vs limit eight. Stretch a sink to worsen e1 slew.

## Slide 9 — Implement track

Call `estimate_slew` and `slew_ok` in solvers. Assert limit from tiny_buf.json.

## Slide 10 — Pitfalls

Using delay as slew. Ignoring C_load. Hard-coding pass without measuring.

## Slide 11 — Your turn

Next: place candidate buffer sites along edges.
