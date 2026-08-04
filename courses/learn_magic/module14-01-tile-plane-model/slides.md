---
marp: true
title: Why Magic internals
paginate: true
---

# Why Magic internals

Map Tile / Plane / CellDef to the Magic C tree

---

## The idea
- GOLDEN: Name the three pillars and how Plane holds DRC rules

---

## Tile
![Tile](assets/steps/01-tile.png)

---

## Plane
![Plane](assets/steps/02-plane.png)

---

## CellDef
![CellDef](assets/steps/03-celldef.png)

---

## Nesting
![Nesting](assets/steps/04-nest.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
- Open **tile-plane-model**
- Click through stages and check goldens

---

## Implement track
- Call tile_plane_model() in internals_solvers; assert golden match

---

## Pitfalls
- Treating browser JSON as the C API
- Confusing Tile with OpenSTA Graph

---

## Try these
- From the common folder, run the internals self-test

---

## Try these — try these

```
cd courses/learn_magic/common
python3 internals_solvers.py
```

---

## Pseudocode
- Here is the checklist in plain steps

---

## Pseudocode — try these

```
Name the three pillars and how Plane holds DRC rules.
```

---

## Next
- Complete the quiz for this part
- Wrap the Magic path , map, CLI evidence, algorithms, and C tree literacy

