# Tile / Plane model

**Module id:** module14-01-tile-plane-model
**Lab:** tile-plane-model
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why Magic internals

Map Tile / Plane / CellDef to the Magic C tree.

## Slide 2 — The idea

GOLDEN: Name the three pillars and how Plane holds DRC rules.

<!-- algorithm-walkthrough -->

## Slide 3 — Tile

![Tile](assets/steps/01-tile.png)

Tile holds painted rectangles and labels.

## Slide 4 — Plane

![Plane](assets/steps/02-plane.png)

Plane holds layer definitions and DRC rules.

## Slide 5 — CellDef

![CellDef](assets/steps/03-celldef.png)

CellDef holds ports and hierarchy metadata.

## Slide 6 — Nesting

![Nesting](assets/steps/04-nest.png)

Tiles live on Planes; CellDef wraps the cell view.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: Tile, Plane, CellDef — three pillars.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

Open **tile-plane-model**. Click through stages and check goldens.

## Slide 9 — Implement track

Call tile_plane_model() in internals_solvers; assert golden match.

## Slide 10 — Pitfalls

Treating browser JSON as the C API. Confusing Tile with OpenSTA Graph.

## Slide 11 — Try these

From the common folder, run the internals self-test.

```bash
cd courses/learn_magic/common
python3 internals_solvers.py
```

## Slide 12 — Pseudocode

Here is the checklist in plain steps.

```text
Name the three pillars and how Plane holds DRC rules.
```

## Slide 13 — Next

Wrap the Magic path — map, CLI evidence, algorithms, and C tree literacy.
