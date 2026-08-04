# Layer query algorithm

**Module id:** module09-01-layer-query-algo
**Lab:** layer-query-algo

## Slide 1 — Why algorithms

Query shapes grouped by layer name.

## Slide 2 — The idea

GOLDEN: layer_query_count=2.

<!-- algorithm-walkthrough -->

## Slide 3 — poly group

![poly group](assets/steps/01-poly.png)

Query returns p0 on poly layer.

## Slide 4 — metal1 group

![metal1 group](assets/steps/02-m1.png)

Query returns m0 on metal1.

## Slide 5 — Two layers

![Two layers](assets/steps/03-count.png)

layer_query_count=2.

## Slide 6 — Layer query

![Layer query](assets/steps/04-algo.png)

Group shape ids by layer name.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: layer_query_count=2.

<!-- /algorithm-walkthrough -->

## Slide 8 — Browser lab

Open **layer-query-algo**.

## Slide 9 — Implement track

Run algo_solvers.py and partc_bind.py.

## Slide 10 — Pitfalls

Changing tiny_algo_klayout without updating Part B goldens.

## Slide 11 — Try these

From the common folder, run the Part C self-tests.

```bash
cd courses/learn_klayout/common
python3 algo_solvers.py
python3 partc_bind.py
```

## Slide 12 — Pseudocode

Here is the check in plain steps.

```text
layer_query_count=2.
ok if goldens match and bind
```

## Slide 13 — Next

Continue Part C, then internals.
