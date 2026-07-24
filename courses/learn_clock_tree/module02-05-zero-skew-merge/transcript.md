# Zero-skew merge (DME lite)

**Module id:** module02-05-zero-skew-merge
**Lab:** zero-skew-merge
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Zero-skew merge

Deferred-merge embedding equalizes delay so opposite arms arrive together.

## Slide 2 — The idea

Partition sinks left and right of the source. Choose a meeting steiner so left radius plus wire matches right radius plus wire. That is the zero-skew intuition.

<!-- algorithm-walkthrough -->

## Slide 3 — DME lite

![DME lite](assets/steps/01-idea.png)

Split sinks left/right of source; meet at a point that balances subtree radii.

## Slide 4 — Balanced meet

![Balanced meet](assets/steps/02-demo.png)

Zero-skew demo places a merge steiner near CLK.

## Slide 5 — Symmetric paths

![Symmetric paths](assets/steps/03-path.png)

Opposite sinks should see similar source latency.

## Slide 6 — Read skew

![Read skew](assets/steps/04-skew.png)

Overlay reports near-zero skew on the toy spread.

## Slide 7 — Toy only

![Toy only](assets/steps/05-limit.png)

Full DME embeds delay recursively on every merge — this lab is the intuition.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **zero-skew-merge**. Run Zero-skew merge demo. Confirm skew near zero to three. Select A and B and compare latencies.

## Slide 9 — Implement track

Call `zero_skew_merge(a,b,da,db)` for a 1D pair; run the browser demo for the full chip. Assert |la−lb| ≈ 0 for equal da,db.

## Slide 10 — Pitfalls

Balancing Euclidean radii. Ignoring existing subtree delay da/db. Expecting full industrial DME from this toy.

## Slide 11 — Your turn

Next: tapping points where the tree forks.
