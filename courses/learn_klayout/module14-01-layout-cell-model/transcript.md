# Layout / Cell / Instance model

**Module id:** module14-01-layout-cell-model
**Lab:** layout-cell-model

## Slide 1 — Why KLayout internals

Map Layout / Cell / Instance to the KLayout C++ tree.

## Slide 2 — The idea

GOLDEN: Name the three pillars and how Cell holds shapes.

<!-- algorithm-walkthrough -->

## Slide 3 — Layout

![Layout](assets/steps/01-layout.png)

Layout holds database, layer properties, cell index.

## Slide 4 — Cell

![Cell](assets/steps/02-cell.png)

Cell holds shapes and child instances.

## Slide 5 — Instance

![Instance](assets/steps/03-inst.png)

Instance places child cells with transform.

## Slide 6 — Nesting

![Nesting](assets/steps/04-nest.png)

Layout→Cell→Instance hierarchy.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: Layout, Cell, Instance — three pillars.

<!-- /algorithm-walkthrough -->

## Slide 8 — Browser lab

Open **layout-cell-model**.

## Slide 9 — Implement track

Call layout_cell_model() in internals_solvers.

## Slide 10 — Pitfalls

Treating browser JSON as the C++ API.

## Slide 11 — Try these

From the common folder, run the internals self-test.

```bash
cd courses/learn_klayout/common
python3 internals_solvers.py
```

## Slide 12 — Pseudocode

Here is the checklist in plain steps.

```text
Name the three pillars and how Cell holds shapes.
ok if goldens match INTERNALS_GOLDENS
```

## Slide 13 — Next

Wrap the KLayout path.
