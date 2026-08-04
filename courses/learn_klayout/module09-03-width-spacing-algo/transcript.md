# Width spacing algorithm

**Module id:** module09-03-width-spacing-algo
**Lab:** width-spacing-algo

## Slide 1 — Why algorithms

Check min_width rules; find m0 violation.

## Slide 2 — The idea

GOLDEN: width_violations=1 on m0.

<!-- algorithm-walkthrough -->

## Slide 3 — min_width

![min_width](assets/steps/01-rule.png)

metal1 min_width=40.

## Slide 4 — m0 violation

![m0 violation](assets/steps/02-m0.png)

m0 width 20 fails rule.

## Slide 5 — poly ok

![poly ok](assets/steps/03-poly.png)

p0 width 50 passes.

## Slide 6 — Width check

![Width check](assets/steps/04-algo.png)

Compare shape width to rule limit.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: width_violations=1 on m0.

<!-- /algorithm-walkthrough -->

## Slide 8 — Browser lab

Open **width-spacing-algo**.

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
width_violations=1 on m0.
ok if goldens match and bind
```


## See also

See also: [learn_drc rule deck](../../learn_drc/module01-01-rule-deck/README.md), [width checker](../../learn_drc/module01-03-width-checker/README.md), [spacing checker](../../learn_drc/module01-05-spacing-checker/README.md), [violation markers](../../learn_drc/module02-03-violation-markers/README.md).

## Slide 13 — Next

Continue Part C, then internals.
