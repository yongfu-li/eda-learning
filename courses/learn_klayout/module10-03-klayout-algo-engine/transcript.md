# KLayout algo engine

**Module id:** module10-03-klayout-algo-engine
**Lab:** klayout-algo-engine

## Slide 1 — Why algorithms

Run Part C engine and bind to Part B goldens.

## Slide 2 — The idea

GOLDEN: engine ok; bind width=1 markers=1.

<!-- algorithm-walkthrough -->

## Slide 3 — Layer query ok

![Layer query ok](assets/steps/01-lq.png)

Layer query stage passes.

## Slide 4 — Width ok

![Width ok](assets/steps/02-ws.png)

Width/spacing stage passes.

## Slide 5 — Markers ok

![Markers ok](assets/steps/03-me.png)

Marker emit stage passes.

## Slide 6 — Bind Part B

![Bind Part B](assets/steps/04-bind.png)

Teaching width=1 markers=1 ↔ Part B logs.

## Slide 7 — Engine

![Engine](assets/steps/05-golden.png)

GOLDEN: klayout_algo_engine ok=True.

<!-- /algorithm-walkthrough -->

## Slide 8 — Browser lab

Open **klayout-algo-engine**.

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
engine ok; bind width=1 markers=1.
ok if goldens match and bind
```

## Slide 13 — Next

Continue Part C, then internals.
