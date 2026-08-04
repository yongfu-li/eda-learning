# Real GDS streamout

**Module id:** module08-01-real-gds
**Lab:** real-gds
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why real Magic

gds write and read layer map from log.

## Slide 2 — The idea

GOLDEN: gds_layer_count=6; metal1→49.

<!-- algorithm-walkthrough -->

## Slide 3 — gds write

![gds write](assets/steps/01-cmd.png)

gds write streams layout to GDSII.

## Slide 4 — Six layers

![Six layers](assets/steps/02-layers.png)

GDS map covers six layer types.

## Slide 5 — metal1→49

![metal1→49](assets/steps/03-m1.png)

metal1 maps to GDS layer 49.

## Slide 6 — contact→25

![contact→25](assets/steps/04-contact.png)

Contact cuts map to layer 25.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: gds_layer_count=6.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

Open **real-gds**. Build the Magic recipe or open evidence stages, then Check.

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
gds_layer_count=6; metal1→49.
ok if goldens match
```

## Slide 13 — Next

Continue the Part B evidence track, then algorithms and internals.
