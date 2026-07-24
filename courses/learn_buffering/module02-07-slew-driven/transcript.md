# Slew-driven insertion

**Module id:** module02-07-slew-driven
**Lab:** slew-driven
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Slew-driven

When DP is heavy, a slew check plus mid-edge buffer is a fast practical heuristic.

## Slide 2 — The idea

For each edge compute slew; if above limit, insert BUF_X1 at the midpoint. Lowering the limit forces more insertions.

<!-- algorithm-walkthrough -->

## Slide 3 — Check slew

![Check slew](assets/steps/01-check.png)

Compare estimate_slew to slew_limit.

## Slide 4 — Tight limit

![Tight limit](assets/steps/02-tight.png)

Limit 1 forces inserts on the toy.

## Slide 5 — Mid buffer

![Mid buffer](assets/steps/03-mid.png)

Insertion sits at edge midpoint.

## Slide 6 — Count

![Count](assets/steps/04-count.png)

Challenges score insertion count.

## Slide 7 — vs VG

![vs VG](assets/steps/05-vs.png)

Slew-driven is local; VG optimizes delay options.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **slew-driven**. Click Slew-driven. With default limit, note count; mentally compare to Van Ginneken.

## Slide 9 — Implement track

Call `slew_driven_insert` with slew_limit=1; assert count ≥ 1.

## Slide 10 — Pitfalls

Inserting without measuring slew. Stacking infinite buffers. Ignoring branch load.

## Slide 11 — Your turn

Next: polarity and inverters.
