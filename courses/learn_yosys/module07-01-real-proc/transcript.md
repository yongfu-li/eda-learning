# Real proc pass

**Module id:** module07-01-real-proc
**Lab:** real-proc
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why real

Real proc lowers Verilog processes into RTLIL cells — the child always block becomes $dff.

## Slide 2 — The idea

GOLDEN: after_proc processes=0 has_dff=True; types include $dff.

<!-- algorithm-walkthrough -->

## Slide 3 — Before: process

![Before: process](assets/steps/01-before.png)

No $dff yet — child still has a process.

## Slide 4 — proc runs

![proc runs](assets/steps/02-run.png)

proc creates $dff from always @(posedge clk).

## Slide 5 — Processes cleared

![Processes cleared](assets/steps/03-clear.png)

processes → 0 after proc.

## Slide 6 — $dff present

![$dff present](assets/steps/04-dff.png)

$dff cell appears in the design.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: processes=0 has_dff=True.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

Open **real-proc**. Open **real-proc**. Show proc stage; confirm $dff and processes=0.

## Slide 9 — Implement track

Call pass_real_proc(); assert ok.

## Slide 10 — Pitfalls

Confusing toy pass_proc with real proc. Expecting $dff before proc.

## Slide 11 — Try these

```bash
cd courses/learn_yosys/common
python3 -c "from real_solvers import pass_real_proc; print(pass_real_proc())"
```

## Slide 12 — Pseudocode

```text
before ← processes>0; proc; after ← processes=0 and $dff in types
```

## Slide 13 — Next

Next: flatten + opt.
