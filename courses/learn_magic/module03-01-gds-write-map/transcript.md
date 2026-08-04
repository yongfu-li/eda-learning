# GDS write map

**Module id:** module03-01-gds-write-map
**Lab:** gds-write-map
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why GDS

Map Magic layers to GDS layer numbers.

## Slide 2 — The idea

GOLDEN: gds_layer_count=6; metal1→49.

<!-- algorithm-walkthrough -->

## Slide 3 — GDS map

![GDS map](assets/steps/01-map.png)

Magic gds write maps layer names to GDS numbers.

## Slide 4 — metal1→49

![metal1→49](assets/steps/02-metal1.png)

metal1 streams as GDS layer 49.

## Slide 5 — Six entries

![Six entries](assets/steps/03-count.png)

Six layer/contact mappings in gds_map.

## Slide 6 — Streamout

![Streamout](assets/steps/04-stream.png)

Part A uses a fixed map — real Magic writes .gds.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: gds_layer_count=6.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

Open **gds-write-map**. Run the stage buttons and Check the goldens.

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
gds_layer_count=6; metal1→49.
ok if goldens match
```

## Slide 13 — Next

Continue the Magic Part A map, then the real CLI track.
