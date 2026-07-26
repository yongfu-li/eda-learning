# Lockup latch

**Module id:** module03-01-lockup-latch
**Lab:** lockup-latch
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why lockup

Lockup latches bridge clock domains on scan path.

## Slide 2 — The idea

GOLDEN: lockup_count=1 on f3→f4 (d0→d1).

<!-- algorithm-walkthrough -->

## Slide 3 — Domain crossing

![Domain crossing](assets/steps/01-cross.png)

lockup_between d0 and d1 requires lockup.

## Slide 4 — f3→f4 pair

![f3→f4 pair](assets/steps/02-pair.png)

Consecutive flops f3 (d0) and f4 (d1).

## Slide 5 — Lockup cell

![Lockup cell](assets/steps/03-cell.png)

Insert lockup_f3_f4 between domains.

## Slide 6 — Clock domains

![Clock domains](assets/steps/04-clk.png)

f4 uses clk2; f1–f3 use clk.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: lockup_count=1 on f3→f4.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **lockup-latch**. Confirm one lockup between f3 and f4.

## Slide 9 — Implement track

Call find_lockups(); assert count==1 and from f3 to f4.

## Slide 10 — Pitfalls

Lockup on same domain. Missing clk2 crossing.

## Slide 11 — Your turn

Next: netlist transform.
