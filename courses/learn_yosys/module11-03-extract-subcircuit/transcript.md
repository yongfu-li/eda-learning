# extract subcircuit

**Module id:** module11-03-extract-subcircuit
**Lab:** extract-subcircuit
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why extract

Extract spots library-shaped cones and collapses them to a single macro.

## Slide 2 — The idea

GOLDEN: matches=1; macro=ANDOR2.

<!-- algorithm-walkthrough -->

## Slide 3 — Pattern

![Pattern](assets/steps/01-pat.png)

AND feeding OR is ANDOR2.

## Slide 4 — Match

![Match](assets/steps/02-match.png)

Find isomorphic subgraph.

## Slide 5 — Macro cell

![Macro cell](assets/steps/03-macro.png)

Replace with ANDOR2.

## Slide 6 — Drop pair

![Drop pair](assets/steps/04-drop.png)

Remove matched $and/$or.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: matches=1.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

Open **extract-subcircuit**. Match the ANDOR2 cone and replace it.

## Slide 9 — Implement track

Call algo_extract_iso(); assert matches == 1 and macro == 'ANDOR2'.

## Slide 10 — Pitfalls

Running extract after clean removed the dead OR. Matching OR without an AND driver.

## Slide 11 — Try these

From the common folder, run the algo solvers self-test, or call `algo_extract_iso` directly.

```bash
cd courses/learn_yosys/common
python3 algo_solvers.py
```

## Slide 12 — Pseudocode

Here is the check in plain steps.

```text
on post-proc netlist
find dollar or fed by dollar and
replace pair with ANDOR2 macro
ok if matches == 1
```

## Slide 13 — Next

Next: memory_map algorithm.
