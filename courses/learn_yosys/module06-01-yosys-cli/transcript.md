# Yosys CLI & scripts

**Module id:** module06-01-yosys-cli
**Lab:** yosys-cli
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why yosys

Real Yosys is a pass engine you drive with a .ys script or an interactive shell — not a toy button.

## Slide 2 — The idea

GOLDEN: first three cmds = read_verilog, hierarchy, proc; invoke with yosys -s script.ys.

<!-- algorithm-walkthrough -->

## Slide 3 — Empty design

![Empty design](assets/steps/01-empty.png)

No RTL loaded — recipe starts empty.

## Slide 4 — read_verilog

![read_verilog](assets/steps/02-read.png)

Load rtl/tiny_and_or.v into Yosys.

## Slide 5 — hierarchy -top

![hierarchy -top](assets/steps/03-hier.png)

hierarchy -check -top top sets the design root.

## Slide 6 — proc next

![proc next](assets/steps/04-proc.png)

Third command is proc — processes become cells.

## Slide 7 — Golden order

![Golden order](assets/steps/05-golden.png)

GOLDEN: read → hierarchy → proc.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

Open **yosys-cli**. Open **yosys-cli**. Append read_verilog, hierarchy, proc in order.

## Slide 9 — Implement track

Call pass_cli_check(['read_verilog','hierarchy','proc']); assert ok.

## Slide 10 — Pitfalls

Starting with proc. Skipping hierarchy -top.

## Slide 11 — Try these

```bash
cd courses/learn_yosys/common
python3 -c "from real_solvers import pass_cli_check; print(pass_cli_check())"
```

## Slide 12 — Pseudocode

```text
recipe ← []; append read_verilog; hierarchy; proc; ok ← prefix matches golden
```

## Slide 13 — Next

Next: RTLIL vocabulary.
