# ABC handoff

**Module id:** module13-01-abc-handoff
**Lab:** abc-handoff
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why abc

Yosys abc is a bridge: you hand an AIG-shaped cone to an external optimizer.

## Slide 2 — The idea

GOLDEN: abc_aig_ands=3 after opt_merge-shaped handoff.

<!-- algorithm-walkthrough -->

## Slide 3 — After opt

![After opt](assets/steps/01-opt.png)

Merged netlist ready for ABC.

## Slide 4 — AND budget

![AND budget](assets/steps/02-count.png)

Count AND-ish nodes.

## Slide 5 — Mux cost

![Mux cost](assets/steps/03-mux.png)

Each $mux counts as two ANDs.

## Slide 6 — abc pass

![abc pass](assets/steps/04-bridge.png)

Yosys abc bridges to ABC/ABC9.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: aig_ands=3.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

Open **abc-handoff**. Count AND nodes for the ABC handoff.

## Slide 9 — Implement track

Call algo_abc_handoff(); assert aig_ands == 3.

## Slide 10 — Pitfalls

Counting before merge. Treating mux as one AND instead of two in this model.

## Slide 11 — Try these

From the common folder, run the algo solvers self-test, or call `algo_abc_handoff` directly.

```bash
cd courses/learn_yosys/common
python3 algo_solvers.py
```

## Slide 12 — Pseudocode

Here is the check in plain steps.

```text
after opt_merge
and += 1 per dollar and; += 2 per dollar mux
ok if aig_ands == 3
```

## Slide 13 — Next

Next: full Yosys algo engine check.
