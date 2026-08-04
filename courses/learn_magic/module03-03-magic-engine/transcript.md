# Magic engine (map)

**Module id:** module03-03-magic-engine
**Lab:** magic-engine
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why Magic

Run the full Part A engine; ok when every golden matches.

## Slide 2 — The idea

GOLDEN: magic_engine ok=True.

<!-- algorithm-walkthrough -->

## Slide 3 — Paint ok

![Paint ok](assets/steps/01-paint.png)

Paint layers stage passes.

## Slide 4 — Select ok

![Select ok](assets/steps/02-select.png)

Select box stage passes.

## Slide 5 — Contact ok

![Contact ok](assets/steps/03-contact.png)

Contact stage passes.

## Slide 6 — DRC ok

![DRC ok](assets/steps/04-drc.png)

DRC stage passes.

## Slide 7 — Engine golden

![Engine golden](assets/steps/05-golden.png)

GOLDEN: magic_engine ok=True.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

Open **magic-engine**. Run the stage buttons and Check the goldens.

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
magic_engine ok=True.
ok if goldens match
```

## Slide 13 — Next

Continue the Magic Part A map, then the real CLI track.
