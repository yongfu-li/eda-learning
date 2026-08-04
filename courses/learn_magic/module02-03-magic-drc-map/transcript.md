# Magic DRC map

**Module id:** module02-03-magic-drc-map
**Lab:** magic-drc-map
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why Magic

Run DRC width check; find violation on thin metal1.

## Slide 2 — The idea

GOLDEN: drc_error_count=1 on thin.

<!-- algorithm-walkthrough -->

## Slide 3 — drc check

![drc check](assets/steps/01-drc.png)

Magic drc check scans width rules.

## Slide 4 — min_width

![min_width](assets/steps/02-rule.png)

metal1 min_width=2 on this tech.

## Slide 5 — Violation

![Violation](assets/steps/03-thin.png)

thin metal1 has width 1 < 2.

## Slide 6 — Error count

![Error count](assets/steps/04-error.png)

Exactly one width error.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: drc_error_count=1 on thin.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

Open **magic-drc-map**. Run the stage buttons and Check the goldens.

## Slide 9 — Implement track

From common/, run solvers.py and confirm MAGIC_PARTA_OK.

## Slide 10 — Pitfalls

Mixing KLayout viewer shortcuts with Magic paint commands. Forgetting min_width when reading DRC errors.

## Slide 11 — Try these

From the common folder, run the Magic map self-test.

```bash
cd courses/learn_magic/common
python3 solvers.py
```

## Slide 12 — Pseudocode

Here is the check in plain steps.

```text
drc_error_count=1 on thin.
ok if goldens match
```

## Slide 13 — Next

Continue the Magic Part A map, then the real CLI track.
