# Check suite

**Module id:** module02-03-check-suite
**Lab:** check-suite
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why check suite

STA, DRC, LVS, ERC, antenna, and IR form the toy check suite.

## Slide 2 — The idea

GOLDEN: fail_count=2, pass_count=4.

<!-- algorithm-walkthrough -->

## Slide 3 — Six checks

![Six checks](assets/steps/01-suite.png)

STA, DRC, LVS, ERC, Antenna, IR in the suite.

## Slide 4 — STA fail

![STA fail](assets/steps/02-sta.png)

STA slack −0.05 — timing fail.

## Slide 5 — Layout pass

![Layout pass](assets/steps/03-layout.png)

DRC, LVS, ERC all pass.

## Slide 6 — Antenna fail

![Antenna fail](assets/steps/04-ant.png)

One antenna violation remains.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: fail_count=2 (sta, antenna).

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **check-suite**. Run checks; confirm 2 fails.

## Slide 9 — Implement track

Call run_checks(); assert fail_count==2 and pass_count==4.

## Slide 10 — Pitfalls

Counting IR as fail. Missing antenna in fail set.

## Slide 11 — Your turn

Next: ECO loop.
