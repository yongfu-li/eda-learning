# Latency and skew

**Module id:** module01-03-latency-skew
**Lab:** latency-skew
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Latency and skew

Skew is the CTS scoreboard: how different are arrival times at sinks.

## Slide 2 — The idea

Walk the tree from source to each sink summing Manhattan edge lengths. Skew equals max latency minus min latency. Wire delay per unit is one on the toy.

<!-- algorithm-walkthrough -->

## Slide 3 — Skew = max − min

![Skew = max − min](assets/steps/01-def.png)

Per-sink latency is Manhattan length along the tree; skew is max minus min.

## Slide 4 — H-tree skew

![H-tree skew](assets/steps/02-h.png)

Build H-tree on spread and read skew overlay.

## Slide 5 — MMM skew

![MMM skew](assets/steps/03-mmm.png)

MMM merge may differ from H-tree on the same sinks.

## Slide 6 — Path to A

![Path to A](assets/steps/04-path.png)

Highlight sink A — yellow edges show source→A path.

## Slide 7 — Drive skew down

![Drive skew down](assets/steps/05-goal.png)

Move sinks or switch topology to clear challenge bounds.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **latency-skew**. Build H-tree, read skew, then Build MMM and compare. Select A to highlight its path.

## Slide 9 — Implement track

Implement or call `latency(path)` and `skew(latencies)` in `common/solvers.py`. Print skew for MMM on tiny_cts.

## Slide 10 — Pitfalls

Using Euclidean distance. Comparing sinks without a tree. Treating buffer delay as wire length without counting buffers.

## Slide 11 — Your turn

Next: grow a classic H-tree topology.
