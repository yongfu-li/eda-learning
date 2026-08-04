# Magic CLI & scripts

**Module id:** module06-01-magic-cli
**Lab:** magic-cli
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why real Magic

Invoke magic -dnull -noconsole script.tcl; recipe starts tech_load→load_cell.

## Slide 2 — The idea

GOLDEN: First two cmds: tech_load, load_cell.

<!-- algorithm-walkthrough -->

## Slide 3 — magic -dnull

![magic -dnull](assets/steps/01-invoke.png)

Magic runs Tcl with magic -dnull -noconsole script.tcl.

## Slide 4 — tech load

![tech load](assets/steps/02-tech.png)

First load the technology file.

## Slide 5 — load cell

![load cell](assets/steps/03-cell.png)

Then load the tiny_inv layout.

## Slide 6 — paint verify

![paint verify](assets/steps/04-verify.png)

Verify rect and contact counts.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: recipe prefix tech_load→load_cell.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

Open **magic-cli**. Build the Magic recipe or open evidence stages, then Check.

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
First two cmds: tech_load, load_cell.
ok if goldens match
```

## Slide 13 — Next

Continue the Part B evidence track, then algorithms and internals.
