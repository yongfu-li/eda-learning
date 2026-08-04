# Device classes map

**Module id:** module01-03-device-classes-map
**Lab:** device-classes-map
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why Device

Map nmos/pmos device classes for compare groups.

## Slide 2 — The idea

GOLDEN: classes=2 (nmos, pmos).

<!-- algorithm-walkthrough -->

## Slide 3 — nmos class

![nmos class](assets/steps/01-nmos.png)

nmos devices grouped for compare.

## Slide 4 — pmos class

![pmos class](assets/steps/02-pmos.png)

pmos devices grouped separately.

## Slide 5 — Class map

![Class map](assets/steps/03-map.png)

classes nmos→nmos, pmos→pmos.

## Slide 6 — Two classes

![Two classes](assets/steps/04-dev.png)

Teaching golden class_count=2.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: class_count=2.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

Open **device-classes-map**. Run the stage buttons and Check the goldens.

## Slide 9 — Implement track

From common/, run solvers.py and confirm NETGEN_PARTA_OK.

## Slide 10 — Pitfalls

Confusing schematic SPICE with layout extract. Forgetting permute on source/drain.

## Slide 11 — Try these

From the common folder, run the Netgen map self-test.

```bash
cd courses/learn_netgen/common
python3 solvers.py
```

## Slide 12 — Pseudocode

Here is the check in plain steps.

```text
classes=2 (nmos, pmos).
ok if goldens match
```

## Slide 13 — Next

Continue the Netgen Part A map, then the real CLI track.
