# Period bound / FEAS lite

**Module id:** module03-01-period-bound
**Lab:** period-bound
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Period bound

Given target period φ, a retiming is feasible if it is legal and the clock period is at most φ.

## Slide 2 — The idea

feas_check(data, 5, r) after forward on a: period 5 ≤ target 5 — passes.

<!-- algorithm-walkthrough -->

## Slide 3 — FEAS lite

![FEAS lite](assets/steps/01-feas.png)

feas_check: legal AND period ≤ target.

## Slide 4 — Target 5

![Target 5](assets/steps/02-target.png)

GOLDENS.periodTarget = 5.

## Slide 5 — Baseline fails

![Baseline fails](assets/steps/03-base-fail.png)

Period 8 > 5, so baseline is not feasible for the target.

## Slide 6 — Forward passes

![Forward passes](assets/steps/04-fwd-pass.png)

Forward on a: legal and P=5 ≤ 5 — feasible.

## Slide 7 — Full WD later

![Full WD later](assets/steps/05-wd.png)

Real tools use W/D matrices; we only try a few retimings.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **period-bound**. Set target 5; run Check after forward on a.

## Slide 9 — Implement track

Call feas_check(DATA, 5, r) with forward-on-a r; expect True.

## Slide 10 — Pitfalls

Forgetting legality in FEAS. Comparing to target 8 instead of 5.

## Slide 11 — Your turn

Next: min-period search across candidate retimings.
