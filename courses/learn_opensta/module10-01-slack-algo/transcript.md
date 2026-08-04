# Slack algorithm

**Module id:** module10-01-slack-algo
**Lab:** slack-algo
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why algorithms

Compute slack and the critical path.

## Slide 2 — The idea

GOLDEN: slack=8; path b→n1→n2→y.

<!-- algorithm-walkthrough -->

## Slide 3 — Slack

![Slack](assets/steps/01-formula.png)

Slack equals required minus arrival.

## Slide 4 — Value 8

![Value 8](assets/steps/02-value.png)

With period 10 and arrival 2, slack is 8.

## Slide 5 — Critical path

![Critical path](assets/steps/03-path.png)

Backtrace picks b→n1→n2→y.

## Slide 6 — Tie-break

![Tie-break](assets/steps/04-tie.png)

Equal arrivals from a and b; name tie-break chooses b.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: slack=8 path b→n1→n2→y.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

Open **slack-algo**. Run Graph / Levelize / Propagate / Slack / Bind, then Check.

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
slack=8; path b→n1→n2→y.
ok if goldens match and bind
```

## Slide 13 — Next

Continue Part C, then wrap — internals literacy is next.
