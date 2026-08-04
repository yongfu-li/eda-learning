# Paint layers

**Module id:** module01-01-paint-layers
**Lab:** paint-layers
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why Paint

Place rectangles on named Magic layers (paint).

## Slide 2 — The idea

GOLDEN: 6 rects; metal1 paint=2.

<!-- algorithm-walkthrough -->

## Slide 3 — Six rectangles

![Six rectangles](assets/steps/01-rects.png)

tiny_inv has six painted rectangles.

## Slide 4 — Layer names

![Layer names](assets/steps/02-layers.png)

Layers: ndiff, pdiff, poly, metal1, nwell, pwell.

## Slide 5 — metal1 paint

![metal1 paint](assets/steps/03-metal1.png)

Two metal1 rectangles: m1y and thin.

## Slide 6 — Paint command

![Paint command](assets/steps/04-paint.png)

Magic paint places rects on the active layer.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: rect_count=6; paint_metal1=2.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

Open **paint-layers**. Run the stage buttons and Check the goldens.

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
6 rects; metal1 paint=2.
ok if goldens match
```

## Slide 13 — Next

Continue the Magic Part A map, then the real CLI track.
