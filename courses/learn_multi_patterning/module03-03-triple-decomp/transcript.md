# Triple decomp literacy

**Module id:** module03-03-triple-decomp
**Lab:** triple-decomp
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Decomp literacy

Production flows may use greedy heuristics or exact backtrack — know when they differ.

## Slide 2 — The idea

On tiny_mp both methods succeed; colors_used=3 for greedy and backtrack.

<!-- algorithm-walkthrough -->

## Slide 3 — Greedy

![Greedy](assets/steps/01-g.png)

Greedy 3-color in id order.

## Slide 4 — Backtrack

![Backtrack](assets/steps/02-b.png)

Backtrack finds a valid coloring.

## Slide 5 — Same used

![Same used](assets/steps/03-same.png)

Both use 3 on the toy.

## Slide 6 — Methods

![Methods](assets/steps/04-meth.png)

Decomp literacy: greedy vs search.

## Slide 7 — Choose

![Choose](assets/steps/05-ch.png)

Prefer BT when greedy fails.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **triple-decomp**. Run both methods; compare colors_used.

## Slide 9 — Implement track

Compare color_greedy(G,3) vs color_backtrack(G,3); assert both ok.

## Slide 10 — Pitfalls

Assuming greedy always equals backtrack. Ignoring failure cases on larger graphs.

## Slide 11 — Your turn

Next: quad patterning with headroom.
