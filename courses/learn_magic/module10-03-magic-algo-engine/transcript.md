# Magic algo engine

**Module id:** module10-03-magic-algo-engine
**Lab:** magic-algo-engine
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why algorithms

Run the full Part C engine and bind to real Magic goldens.

## Slide 2 — The idea

GOLDEN: engine ok; bind drc 1↔1, gds 6↔6.

<!-- algorithm-walkthrough -->

## Slide 3 — Connectivity ok

![Connectivity ok](assets/steps/01-conn.png)

Paint connectivity matches goldens.

## Slide 4 — DRC ok

![DRC ok](assets/steps/02-drc.png)

Region scan matches drc_error_count=1.

## Slide 5 — Extract ok

![Extract ok](assets/steps/03-ext.png)

Extract node count matches.

## Slide 6 — Bind real

![Bind real](assets/steps/04-bind.png)

Teaching DRC/GDS/contact ↔ Part B logs.

## Slide 7 — Engine

![Engine](assets/steps/05-golden.png)

GOLDEN: magic_algo_engine ok=True.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

Open **magic-algo-engine**. Run connectivity / DRC / extract / bind, then Check.

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
engine ok; bind drc 1↔1, gds 6↔6.
ok if goldens match and bind
```

## Slide 13 — Next

Continue Part C, then internals literacy.
