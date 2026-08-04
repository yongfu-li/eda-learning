# OpenSTA algo engine

**Module id:** module10-03-opensta-algo-engine
**Lab:** opensta-algo-engine
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why algorithms

Run the full Part C engine and bind to real report goldens.

## Slide 2 — The idea

GOLDEN: engine ok; bind slack 8↔8.

<!-- algorithm-walkthrough -->

## Slide 3 — Graph ok

![Graph ok](assets/steps/01-graph.png)

Graph build matches goldens.

## Slide 4 — Propagate ok

![Propagate ok](assets/steps/02-prop.png)

Arrival and required match.

## Slide 5 — Slack ok

![Slack ok](assets/steps/03-slack.png)

Slack and path match.

## Slide 6 — Bind real

![Bind real](assets/steps/04-bind.png)

Teaching slack equals Part B report slack.

## Slide 7 — Engine

![Engine](assets/steps/05-golden.png)

GOLDEN: opensta_algo_engine ok=True.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

Open **opensta-algo-engine**. Run Graph / Levelize / Propagate / Slack / Bind, then Check.

## Slide 9 — Implement track

From common/, run algo_solvers.py and partc_bind.py.

## Slide 10 — Pitfalls

Changing tiny_algo_sta without updating Part B liberty delays. Ignoring the bind side.

## Slide 11 — Try these

From the common folder, run the Part C self-tests.

```bash
cd courses/learn_opensta/common
python3 algo_solvers.py
python3 partc_bind.py
```

## Slide 12 — Pseudocode

Here is the check in plain steps.

```text
engine ok; bind slack 8↔8.
ok if goldens match and bind
```

## Slide 13 — Next

Continue Part C, then wrap — internals literacy is next.
