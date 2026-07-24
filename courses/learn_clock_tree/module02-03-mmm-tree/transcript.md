# Method of Means and Medians

**Module id:** module02-03-mmm-tree
**Lab:** mmm-tree
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Method of Means and Medians

When sinks are irregular, greedy merge adapts better than a pure geometric H.

## Slide 2 — The idea

Treat each sink as a fragment. Repeatedly merge the closest pair of fragment roots at their midpoint, then trunk the final root to the clock source.

<!-- algorithm-walkthrough -->

## Slide 3 — Means & medians

![Means & medians](assets/steps/01-idea.png)

Repeatedly merge the closest fragment roots at their midpoint.

## Slide 4 — Merged tree

![Merged tree](assets/steps/02-build.png)

MMM connects all sinks then trunks to the source.

## Slide 5 — Merge points

![Merge points](assets/steps/03-steiners.png)

Steiners mark where two subtrees join.

## Slide 6 — vs H-tree

![vs H-tree](assets/steps/04-vs-h.png)

MMM adapts to irregular sink sets better than pure H geometry.

## Slide 7 — Toward DME

![Toward DME](assets/steps/05-next.png)

Zero-skew merge balances subtree delays explicitly.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **mmm-tree**. Build MMM, read skew, then rebuild after moving C. Compare to H-tree skew.

## Slide 9 — Implement track

Call `mmm_tree(source, sinks)` in solvers. Assert every sink endpoint appears in the edge set.

## Slide 10 — Pitfalls

Merging by Euclidean when latency is Manhattan. Forgetting to connect the final fragment to the source. Dropping steiner coordinates when buffering.

## Slide 11 — Your turn

Next: zero-skew merge (DME lite).
