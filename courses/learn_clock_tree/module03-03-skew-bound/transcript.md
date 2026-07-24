# Skew bound with buffers

**Module id:** module03-03-skew-bound
**Lab:** skew-bound
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Skew bound with buffers

Signoff asks: is skew under budget? This lab makes that a Check button.

## Slide 2 — The idea

skew_bound_ok is true when skew ≤ bound. Zero-skew merge often meets bound two on the toy; H-tree may need moves or a different mode.

<!-- algorithm-walkthrough -->

## Slide 3 — Target bound

![Target bound](assets/steps/01-bound.png)

Challenges ask skew ≤ GOLDENS.skewBoundDefault (2) on the toy.

## Slide 4 — Zero-skew helps

![Zero-skew helps](assets/steps/02-zs.png)

Zero-skew merge often meets the bound without moving sinks.

## Slide 5 — H may miss

![H may miss](assets/steps/03-fail.png)

H-tree skew can exceed the tight bound on this spread.

## Slide 6 — Buffers + bound

![Buffers + bound](assets/steps/04-buf.png)

Buffering changes latencies — re-check the bound after insert.

## Slide 7 — Toward signoff

![Toward signoff](assets/steps/05-signoff.png)

Real CTS targets skew under corners; this lab is the scalar habit.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **skew-bound**. Run Zero-skew merge demo and Check. Try H-tree and see if you need to move sinks to meet bound two.

## Slide 9 — Implement track

Call `skew_bound_ok(latencies, bound)`. Document GOLDENS.skewBoundDefault = 2.

## Slide 10 — Pitfalls

Hard-coding pass without measuring. Forgetting to rebuild after moving sinks. Mixing buffered and unbuffered latencies.

## Slide 11 — Your turn

Next: sequential CTS connecting sinks in order.
