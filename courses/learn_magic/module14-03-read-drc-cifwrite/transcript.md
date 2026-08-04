# Read DRC / cifwrite

**Module id:** module14-03-read-drc-cifwrite
**Lab:** read-drc-cifwrite
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why Magic internals

Read the DRC scan → marker shape bound to Part B goldens.

## Slide 2 — The idea

GOLDEN: load_rules → scan_region → emit_marker (drc=1); cifwrite stages.

<!-- algorithm-walkthrough -->

## Slide 3 — load_rules

![load_rules](assets/steps/01-rules.png)

Load tech min_width for metal1 from Plane.

## Slide 4 — scan_region

![scan_region](assets/steps/02-scan.png)

Walk tiles on the active plane.

## Slide 5 — emit_marker

![emit_marker](assets/steps/03-emit.png)

Flag thin rect (width=1 < limit=2).

## Slide 6 — cifwrite

![cifwrite](assets/steps/04-cif.png)

flatten → write_cif → verify_layers (6 GDS layers).

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: DRC→Part B drc=1; GDS layers=6.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

Open **read-drc-cifwrite**. Click through stages and check goldens.

## Slide 9 — Implement track

Call read_drc_cifwrite() in internals_solvers; assert golden match.

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
load_rules → scan_region → emit_marker (drc=1); cifwrite stages.
```

## Slide 13 — Next

Wrap the Magic path — map, CLI evidence, algorithms, and C tree literacy.
