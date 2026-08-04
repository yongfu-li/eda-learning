# Real DRC

**Module id:** module07-03-real-drc
**Lab:** real-drc
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why real Magic

Run drc check; find width violation on thin metal1.

## Slide 2 — The idea

GOLDEN: drc_error_count=1; thin on metal1.

<!-- algorithm-walkthrough -->

## Slide 3 — drc check

![drc check](assets/steps/01-cmd.png)

drc check scans planes against tech rules.

## Slide 4 — thin metal1

![thin metal1](assets/steps/02-thin.png)

Shape thin has width=1 < min_width=2.

## Slide 5 — metal1

![metal1](assets/steps/03-layer.png)

Violation is on metal1.

## Slide 6 — One error

![One error](assets/steps/04-count.png)

Teaching log reports DRC_ERRORS=1.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: drc_error_count=1 on thin.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

Open **real-drc**. Build the Magic recipe or open evidence stages, then Check.

## Slide 9 — Implement track

From common/, run real_solvers.py and confirm REAL_MAGIC_OK.

## Slide 10 — Pitfalls

Editing goldens by hand without re-running scripts. Confusing Part A map JSON with checked-in logs.

## Slide 11 — Try these

From the common folder, run the real Magic self-test.

```bash
cd courses/learn_magic/common
python3 real_solvers.py
```

## Slide 12 — Pseudocode

Here is the check in plain steps.

```text
drc_error_count=1; thin on metal1.
ok if goldens match
```

## Slide 13 — Next

Continue the Part B evidence track, then algorithms and internals.
