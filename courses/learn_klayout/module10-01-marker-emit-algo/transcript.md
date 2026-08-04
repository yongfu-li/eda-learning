# Marker emit algorithm

**Module id:** module10-01-marker-emit-algo
**Lab:** marker-emit-algo

## Slide 1 — Why algorithms

Emit DRC markers from violations.

## Slide 2 — The idea

GOLDEN: marker_count=1.

<!-- algorithm-walkthrough -->

## Slide 3 — Violation

![Violation](assets/steps/01-vio.png)

Width violation on m0.

## Slide 4 — Emit marker

![Emit marker](assets/steps/02-emit.png)

Create marker record per violation.

## Slide 5 — width type

![width type](assets/steps/03-type.png)

Marker type is width.

## Slide 6 — One marker

![One marker](assets/steps/04-count.png)

marker_count=1.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: marker_count=1.

<!-- /algorithm-walkthrough -->

## Slide 8 — Browser lab

Open **marker-emit-algo**.

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
marker_count=1.
ok if goldens match and bind
```

## Slide 13 — Next

Continue Part C, then internals.
