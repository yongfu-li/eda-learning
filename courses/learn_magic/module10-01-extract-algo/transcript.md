# Extract algorithm

**Module id:** module10-01-extract-algo
**Lab:** extract-algo
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why algorithms

Extract device/active nodes from poly/ndiff/pdiff.

## Slide 2 — The idea

GOLDEN: extract_nodes=3.

<!-- algorithm-walkthrough -->

## Slide 3 — Gate poly

![Gate poly](assets/steps/01-poly.png)

Extract poly shape g as gate node.

## Slide 4 — ndiff

![ndiff](assets/steps/02-nd.png)

Extract nd as source/drain region.

## Slide 5 — pdiff

![pdiff](assets/steps/03-pd.png)

Extract pd as source/drain region.

## Slide 6 — Three nodes

![Three nodes](assets/steps/04-nodes.png)

Teaching extract_nodes=3.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: extract_nodes=3.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

Open **extract-algo**. Run connectivity / DRC / extract / bind, then Check.

## Slide 9 — Implement track

From common/, run algo_solvers.py and partc_bind.py.

## Slide 10 — Pitfalls

Changing tiny_algo_magic without updating Part B goldens. Ignoring the bind side.

## Slide 11 — Try these

From the common folder, run the Part C self-tests.

```bash
cd courses/learn_magic/common
python3 algo_solvers.py
python3 partc_bind.py
```

## Slide 12 — Pseudocode

Here is the check in plain steps.

```text
extract_nodes=3.
ok if goldens match and bind
```

## Slide 13 — Next

Continue Part C, then internals literacy.
