# Scan order

**Module id:** module02-03-scan-order
**Lab:** scan-order
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why order

Scan order must include every flop exactly once.

## Slide 2 — The idea

GOLDEN: order f1→f2→f3→f4; covers_all=true.

<!-- algorithm-walkthrough -->

## Slide 3 — Order list

![Order list](assets/steps/01-list.png)

scan_order defines chain sequence left→right.

## Slide 4 — First f1

![First f1](assets/steps/02-f1.png)

Chain starts at f1.

## Slide 5 — Middle f2 f3

![Middle f2 f3](assets/steps/03-mid.png)

f2 and f3 in domain d0.

## Slide 6 — Tail f4

![Tail f4](assets/steps/04-tail.png)

Chain ends at f4 in d1.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: chain_length=4, covers_all=true.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **scan-order**. Confirm length=4 and covers all flops.

## Slide 9 — Implement track

Call scan_order_check(); assert length==4 and covers_all.

## Slide 10 — Pitfalls

Duplicate flop in order. Missing f4.

## Slide 11 — Your turn

Next: lockup latch.
