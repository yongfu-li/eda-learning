# K-feasible cut enumeration

**Module id:** module02-05-cut-enumeration
**Lab:** cut-enumeration
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Cuts

Cuts describe which leaves a subgraph may stand on for techmapping.

## Slide 2 — The idea

PI cut={self}. AND cuts = unions of fanin cuts with size ≤ k, plus trivial {self}.

<!-- algorithm-walkthrough -->

## Slide 3 — K=3

![K=3](assets/steps/01-k.png)

Toy uses cut_k=3.

## Slide 4 — PI cuts

![PI cuts](assets/steps/02-pi.png)

Each PI has a single cut.

## Slide 5 — Combine

![Combine](assets/steps/03-comb.png)

AND cuts combine child cuts under the k limit.

## Slide 6 — PO cuts

![PO cuts](assets/steps/04-po.png)

Node 7 lists several feasible cuts.

## Slide 7 — Stats

![Stats](assets/steps/05-stats.png)

total_cuts grows with graph depth.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **cut-enumeration**. Click Enumerate cuts; select node 7.

## Slide 9 — Implement track

Call enumerate_cuts(k=3); assert all |cut|≤3.

## Slide 10 — Pitfalls

Allowing cuts larger than k. Forgetting the trivial cut.

## Slide 11 — Your turn

Next: the cell library.
