# Select box

**Module id:** module01-03-select-box
**Lab:** select-box
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why Select

Box + select picks geometry for edit / DRC focus.

## Slide 2 — The idea

GOLDEN: select thin metal1; width=1.

<!-- algorithm-walkthrough -->

## Slide 3 — Box select

![Box select](assets/steps/01-box.png)

Magic box + select picks one shape.

## Slide 4 — thin shape

![thin shape](assets/steps/02-thin.png)

The thin metal1 rect has width 1.

## Slide 5 — Edit focus

![Edit focus](assets/steps/03-focus.png)

Selected geometry drives edit and DRC focus.

## Slide 6 — Width check

![Width check](assets/steps/04-width.png)

min(width,height) of thin is 1 lambda.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: selected=thin.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

Open **select-box**. Run the stage buttons and Check the goldens.

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
select thin metal1; width=1.
ok if goldens match
```

## Slide 13 — Next

Continue the Magic Part A map, then the real CLI track.
