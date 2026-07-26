# AIG strash

**Module id:** module02-03-aig-strash
**Lab:** aig-strash
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why strash

strash merges structurally identical AND(a,b) and retargets fans.

## Slide 2 — The idea

GOLDEN: after_strash_cells=4, merge n3→n1.

<!-- algorithm-walkthrough -->

## Slide 3 — Hash key table

![Hash key table](assets/steps/01-hash.png)

Identical AND(a,b) keys merge.

## Slide 4 — c1 and c3

![c1 and c3](assets/steps/02-c1c3.png)

Both AND(a,b) — c3 is duplicate.

## Slide 5 — Merge n3→n1

![Merge n3→n1](assets/steps/03-merge.png)

Retarget fans; drop c3.

## Slide 6 — Four cells

![Four cells](assets/steps/04-four.png)

One AND remains after strash.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: after_strash_cells=4.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **aig-strash**. Confirm cells=4 and n3 merged.

## Slide 9 — Implement track

Call pass_aig_strash(); assert cell_count==4.

## Slide 10 — Pitfalls

Merging unlike cells. Forgetting fan retarget.

## Slide 11 — Your turn

Next: rewrite.
