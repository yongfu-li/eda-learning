# Sequential CTS pass

**Module id:** module04-01-sequential-cts
**Lab:** sequential-cts
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Sequential CTS pass

Some flows grow the clock net in sink order—order changes skew.

## Slide 2 — The idea

Start from the source. For each sink in order A…F, attach an L-route to the nearest existing tree node. Optional buffering splits long legs afterward.

<!-- algorithm-walkthrough -->

## Slide 3 — Net order

![Net order](assets/steps/01-order.png)

Connect sinks A…F one-by-one to the nearest existing tree node.

## Slide 4 — Built pass

![Built pass](assets/steps/02-build.png)

Sequential tree grows from CLK outward.

## Slide 5 — Late sink

![Late sink](assets/steps/03-path.png)

Later sinks may attach far from source — skew can be higher than MMM.

## Slide 6 — Optional buffers

![Optional buffers](assets/steps/04-buf.png)

Insert buffers after sequential to split long legs.

## Slide 7 — Handoff

![Handoff](assets/steps/05-done.png)

You can build H, MMM, DME-lite, sequential — next deepen buffering.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **sequential-cts**. Run Sequential CTS, read skew, optionally Insert buffers. Compare to MMM on the same placement.

## Slide 9 — Implement track

Call `sequential_cts(data, mode='mmm')` for a full pass, or use the browser sequential builder. Print skew.

## Slide 10 — Pitfalls

Assuming order does not matter. Attaching to sinks only, not steiners. Skipping the source as the first node.

## Slide 11 — Your turn

Next: offline benchmark compare, then wrap.
