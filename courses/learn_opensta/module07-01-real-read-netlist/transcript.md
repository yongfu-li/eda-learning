# Real read / link

**Module id:** module07-01-real-read-netlist
**Lab:** real-read-netlist
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why real OpenSTA

Link tiny_combo and see instances u1/u2/u3.

## Slide 2 — The idea

GOLDEN: top=tiny_combo; cells u1,u2,u3.

<!-- algorithm-walkthrough -->

## Slide 3 — Top design

![Top design](assets/steps/01-top.png)

link_design tiny_combo sets the top.

## Slide 4 — Instance u1

![Instance u1](assets/steps/02-u1.png)

u1 is AND2.

## Slide 5 — Instance u2

![Instance u2](assets/steps/03-u2.png)

u2 is BUF.

## Slide 6 — Instance u3

![Instance u3](assets/steps/04-u3.png)

u3 is INV.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: cell_count=3 after link.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

Open **real-read-netlist**. Build the Tcl recipe or open evidence stages, then Check.

## Slide 9 — Implement track

From common/, run real_solvers.py and confirm REAL_OPENSTA_OK.

## Slide 10 — Pitfalls

Editing goldens by hand without re-running sta. Confusing Part A map JSON with real liberty delays.

## Slide 11 — Try these

From the common folder, run the real OpenSTA self-test.

```bash
cd courses/learn_opensta/common
python3 real_solvers.py
```

## Slide 12 — Pseudocode

Here is the check in plain steps.

```text
top=tiny_combo; cells u1,u2,u3.
ok if goldens match
```

## Slide 13 — Next

Continue the Part B evidence track, then wrap — algorithms and internals come later.
