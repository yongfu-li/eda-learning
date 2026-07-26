# OpenSTA CLI & scripts

**Module id:** module06-01-opensta-cli
**Lab:** opensta-cli
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why real OpenSTA

Invoke sta -exit script.tcl; recipe starts read_liberty→read_verilog→link_design.

## Slide 2 — The idea

GOLDEN: First three cmds: read_liberty, read_verilog, link_design.

<!-- algorithm-walkthrough -->

## Slide 3 — sta -exit

![sta -exit](assets/steps/01-invoke.png)

OpenSTA runs Tcl with sta -no_splash -exit script.tcl.

## Slide 4 — read_liberty

![read_liberty](assets/steps/02-lib.png)

First load the liberty timing models.

## Slide 5 — read_verilog

![read_verilog](assets/steps/03-v.png)

Then read the gate-level netlist.

## Slide 6 — link_design

![link_design](assets/steps/04-link.png)

link_design binds cell instances to liberty.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: recipe prefix liberty→verilog→link.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

Open **opensta-cli**. Build the Tcl recipe or open evidence stages, then Check.

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
First three cmds: read_liberty, read_verilog, link_design.
ok if goldens match
```

## Slide 13 — Next

Continue the Part B evidence track, then wrap — algorithms and internals come later.
