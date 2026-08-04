# Hash devices algorithm

**Module id:** module09-01-hash-devices-algo
**Lab:** hash-devices-algo

## Slide 1 — Why algorithms

Hash devices by nmos/pmos class for compare.

## Slide 2 — The idea

GOLDEN: hash_device_count=2.

<!-- algorithm-walkthrough -->

## Slide 3 — Device classes

![Device classes](assets/steps/01-class.png)

Group mn1/mp1 and X0/X1 by type.

## Slide 4 — Hash buckets

![Hash buckets](assets/steps/02-hash.png)

Two class buckets for compare.

## Slide 5 — Schematic side

![Schematic side](assets/steps/03-sch.png)

mn1 nmos, mp1 pmos.

## Slide 6 — Layout side

![Layout side](assets/steps/04-lay.png)

X0 nmos, X1 pmos.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: hash_device_count=2.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab

Open **hash-devices-algo**.

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
hash_device_count=2.
ok if goldens match and bind
```

## Slide 13 — Next

Continue Part C, then internals.
