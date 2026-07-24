# Fanout buffer tree

**Module id:** module03-03-fanout-tree
**Lab:** fanout-tree
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Fanout

One driver cannot feed too many sinks without a buffer tree stage.

## Slide 2 — The idea

If sink count exceeds max_fanout (two on the toy), insert BUF_X2 at S0. Three sinks therefore force an insert.

<!-- algorithm-walkthrough -->

## Slide 3 — Fanout three

![Fanout three](assets/steps/01-fo.png)

Tiny net has three sinks.

## Slide 4 — Max two

![Max two](assets/steps/02-max.png)

max_fanout=2 → must insert.

## Slide 5 — At S0

![At S0](assets/steps/03-s0.png)

Junction buffer sits on S0.

## Slide 6 — BUF_X2

![BUF_X2](assets/steps/04-x2.png)

Stronger cell for the fork.

## Slide 7 — Compose

![Compose](assets/steps/05-compose.png)

Sequential pass can combine VG + fanout.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **fanout-tree**. Click Fanout buffer. Confirm a buffer appears at S0.

## Slide 9 — Implement track

Call `fanout_buffer_tree(data, max_fanout=2)`. Assert inserted is true.

## Slide 10 — Pitfalls

Buffering at the driver only. Using max_fanout ≥ sink count. Forgetting S0 coordinates.

## Slide 11 — Your turn

Next: full sequential buffering pass.
