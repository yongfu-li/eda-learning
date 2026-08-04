# Permute pins algorithm

**Module id:** module10-01-permute-pins-algo
**Lab:** permute-pins-algo

## Slide 1 — Why algorithms

Permute source/drain within MOSFET class.

## Slide 2 — The idea

GOLDEN: permute_ok=True.

<!-- algorithm-walkthrough -->

## Slide 3 — D/S permute

![D/S permute](assets/steps/01-ds.png)

Drain and source may swap.

## Slide 4 — G fixed

![G fixed](assets/steps/02-gate.png)

Gate does not permute.

## Slide 5 — nmos rule

![nmos rule](assets/steps/03-nmos.png)

nmos permute includes D,S.

## Slide 6 — pmos rule

![pmos rule](assets/steps/04-pmos.png)

pmos permute includes D,S.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: permute_ok=True.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab

Open **permute-pins-algo**.

## Slide 9 — Implement track

Run algo_solvers.py and partc_bind.py.

## Slide 10 — Pitfalls

Changing tiny_algo_netgen without updating Part B goldens.

## Slide 11 — Try these

From the common folder, run the Part C self-tests.

```bash
cd courses/learn_netgen/common
python3 algo_solvers.py
python3 partc_bind.py
```

## Slide 12 — Pseudocode

Here is the check in plain steps.

```text
permute_ok=True.
ok if goldens match and bind
```

## Slide 13 — Next

Continue Part C, then internals.
