# techmap mapfile

**Module id:** module11-01-techmap-mapfile
**Lab:** techmap-mapfile
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why techmap

Techmap rewrites generic cells into library primitives via map rules.

## Slide 2 — The idea

GOLDEN: nand_not_count=2 (NAND + NOT).

<!-- algorithm-walkthrough -->

## Slide 3 — Map rule

![Map rule](assets/steps/01-rule.png)

$and → NAND then NOT.

## Slide 4 — Emit NAND

![Emit NAND](assets/steps/02-nand.png)

First cell $_NAND_.

## Slide 5 — Emit NOT

![Emit NOT](assets/steps/03-not.png)

Second cell $_NOT_.

## Slide 6 — Count 2

![Count 2](assets/steps/04-count.png)

nand_not_count=2.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: nand_not=2.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

Open **techmap-mapfile**. Apply the map rule and Check NAND/NOT count.

## Slide 9 — Implement track

Call algo_techmap_mapfile(); assert nand_not_count == 2.

## Slide 10 — Pitfalls

Mapping every cell type at once. Counting NAND without the following NOT.

## Slide 11 — Try these

From the common folder, run the algo solvers self-test, or call `algo_techmap_mapfile` directly.

```bash
cd courses/learn_yosys/common
python3 algo_solvers.py
```

## Slide 12 — Pseudocode

Here is the check in plain steps.

```text
after opt_merge
match dollar and → emit $_NAND_ then $_NOT_
ok if nand_not_count == 2
```

## Slide 13 — Next

Next: extract ANDOR2 subcircuit.
