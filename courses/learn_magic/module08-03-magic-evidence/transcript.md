# Real Magic evidence

**Module id:** module08-03-magic-evidence
**Lab:** magic-evidence
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why real Magic

Run the full real Magic engine against goldens.

## Slide 2 — The idea

GOLDEN: real_magic_engine ok=True.

<!-- algorithm-walkthrough -->

## Slide 3 — Full recipe

![Full recipe](assets/steps/01-recipe.png)

Golden recipe has six Tcl stages.

## Slide 4 — Paint golden

![Paint golden](assets/steps/02-paint.png)

Still six rects and one contact.

## Slide 5 — DRC golden

![DRC golden](assets/steps/03-drc.png)

DRC error count remains 1.

## Slide 6 — GDS golden

![GDS golden](assets/steps/04-gds.png)

GDS layer count remains 6.

## Slide 7 — Engine

![Engine](assets/steps/05-golden.png)

GOLDEN: real_magic_engine ok=True.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

Open **magic-evidence**. Build the Magic recipe or open evidence stages, then Check.

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
real_magic_engine ok=True.
ok if goldens match
```

## Slide 13 — Next

Continue the Part B evidence track, then algorithms and internals.
