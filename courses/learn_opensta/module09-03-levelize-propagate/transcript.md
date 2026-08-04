# Levelize & propagate

**Module id:** module09-03-levelize-propagate
**Lab:** levelize-propagate
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why algorithms

Levelize the graph and propagate arrivals/required.

## Slide 2 — The idea

GOLDEN: levels a/b=0…y=3; A(y)=2 R(y)=10.

<!-- algorithm-walkthrough -->

## Slide 3 — Levelize

![Levelize](assets/steps/01-level.png)

Inputs at level 0; each arc raises sink level by 1.

## Slide 4 — Level n1

![Level n1](assets/steps/02-n1.png)

n1 is level 1.

## Slide 5 — Arrival y

![Arrival y](assets/steps/03-ay.png)

Forward max arrival reaches y at 2.0.

## Slide 6 — Required y

![Required y](assets/steps/04-ry.png)

Required at y equals period 10.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: A(y)=2 R(y)=10.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

Open **levelize-propagate**. Run Graph / Levelize / Propagate / Slack / Bind, then Check.

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
levels a/b=0…y=3; A(y)=2 R(y)=10.
ok if goldens match and bind
```

## Slide 13 — Next

Continue Part C, then wrap — internals literacy is next.
