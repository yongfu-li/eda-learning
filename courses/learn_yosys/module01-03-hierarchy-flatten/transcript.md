# Hierarchy flatten

**Module id:** module01-03-hierarchy-flatten
**Lab:** hierarchy-flatten
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why flatten

Flatten merges child hierarchy so later passes see one module.

## Slide 2 — The idea

GOLDEN: after_flatten_modules=1.

<!-- algorithm-walkthrough -->

## Slide 3 — Two modules

![Two modules](assets/steps/01-two.png)

top holds comb; child holds DFF c6.

## Slide 4 — child DFF

![child DFF](assets/steps/02-child.png)

c6 DFF lives in child before flatten.

## Slide 5 — Flatten pass

![Flatten pass](assets/steps/03-flat.png)

flatten moves all cells into top.

## Slide 6 — All in top

![All in top](assets/steps/04-top.png)

Every cell module field becomes top.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: after_flatten_modules=1.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **hierarchy-flatten**. Confirm module_count=1.

## Slide 9 — Implement track

Call pass_hierarchy_flatten(); assert module_count==1.

## Slide 10 — Pitfalls

Flattening before proc. Forgetting DFF in child.

## Slide 11 — Your turn

Next: opt/DCE.
