# Real flatten & opt

**Module id:** module07-03-real-flatten-opt
**Lab:** real-flatten-opt
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why real

flatten inlines child into top; opt merges identical cells and cleans dead logic.

## Slide 2 — The idea

GOLDEN: flatten modules=1 cells=4; opt cells=4 and_count=1.

<!-- algorithm-walkthrough -->

## Slide 3 — Before flatten

![Before flatten](assets/steps/01-hier.png)

Still two modules with a child instance.

## Slide 4 — flatten

![flatten](assets/steps/02-flat.png)

Child $dff inlined — module_count=1.

## Slide 5 — Four cells

![Four cells](assets/steps/03-four.png)

$and $or $not $dff remain.

## Slide 6 — opt merge

![opt merge](assets/steps/04-opt.png)

opt leaves and_count=1.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: flat cells=4; opt and=1.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

Open **real-flatten-opt**. Open **real-flatten-opt**. Show flatten then opt stages.

## Slide 9 — Implement track

Call pass_real_flatten_opt(); assert ok.

## Slide 10 — Pitfalls

Expecting module_count=2 after flatten. Counting instance cells after flatten.

## Slide 11 — Try these

```bash
cd courses/learn_yosys/common
python3 -c "from real_solvers import pass_real_flatten_opt; print(pass_real_flatten_opt())"
```

## Slide 12 — Pseudocode

```text
flatten → modules=1 cells=4; opt → cells=4 and_count=1
```

## Slide 13 — Next

Next: aigmap + synth.
