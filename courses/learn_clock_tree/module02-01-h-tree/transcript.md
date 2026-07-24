# H-tree topology

**Module id:** module02-01-h-tree
**Lab:** h-tree
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — H-tree topology

H-trees are the classic picture of a balanced clock network on a regular array.

## Slide 2 — The idea

From the source, alternate horizontal and vertical splits toward sink groups. Each split creates steiner points and L-shaped legs to children.

<!-- algorithm-walkthrough -->

## Slide 3 — Recursive H

![Recursive H](assets/steps/01-idea.png)

Alternate horizontal and vertical splits from the source toward sink clusters.

## Slide 4 — Built tree

![Built tree](assets/steps/02-build.png)

H-tree edges fan from CLK to all six sinks.

## Slide 5 — Path highlight

![Path highlight](assets/steps/03-path.png)

Select D to see the source→D corridor.

## Slide 6 — Balance goal

![Balance goal](assets/steps/04-balance.png)

Symmetric splits keep opposite corners similar — not perfect on this toy.

## Slide 7 — When H-tree

![When H-tree](assets/steps/05-use.png)

Use H-trees when sinks fill a rectangle evenly; otherwise MMM or DME.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **h-tree**. Click Build H-tree. Select D and watch the yellow path. Compare skew to the MMM lab next.

## Slide 9 — Implement track

Call `h_tree(source, chip)` / browser `hTree(positions)`. Attach sinks and print edge count and skew.

## Slide 10 — Pitfalls

Stopping after one H without recursion. Connecting sinks with Euclidean edges. Ignoring steiner points when measuring latency.

## Slide 11 — Your turn

Next: Method of Means and Medians for irregular sinks.
