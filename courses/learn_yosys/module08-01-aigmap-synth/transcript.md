# aigmap & synth

**Module id:** module08-01-aigmap-synth
**Lab:** aigmap-synth
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why aigmap

aigmap pushes toward AND/NOT form; synth -top runs Yosys's generic recipe to gate-level cells.

## Slide 2 — The idea

GOLDEN: aigmap cells=7; synth cells=2 types=$_AOI3_,$_DFF_P_.

<!-- algorithm-walkthrough -->

## Slide 3 — Before aigmap

![Before aigmap](assets/steps/01-opt.png)

opt netlist with $and/$or/$not/$dff.

## Slide 4 — aigmap

![aigmap](assets/steps/02-aig.png)

Maps to $_AND_/$_NOT_ — cells=7.

## Slide 5 — synth recipe

![synth recipe](assets/steps/03-synth.png)

synth -top top runs the built-in flow.

## Slide 6 — AOI3 + DFF

![AOI3 + DFF](assets/steps/04-out.png)

Result: $_AOI3_ and $_DFF_P_.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: synth cells=2.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

Open **aigmap-synth**. Open **aigmap-synth**. Show aigmap then synth; select $_AOI3_.

## Slide 9 — Implement track

Call pass_aigmap_synth(); assert ok.

## Slide 10 — Pitfalls

Expecting NAND2 from the toy techmap. Skipping synth -top.

## Slide 11 — Try these

From the common folder, run the real solvers self-test, or call `pass_aigmap_synth` directly.

```bash
cd courses/learn_yosys/common
python3 real_solvers.py
```

## Slide 12 — Pseudocode

Here is the check in plain steps.

```text
aigmap then synth
assert cells seven then two AOI and DFF
```

## Slide 13 — Next

Next: real evidence engine.
