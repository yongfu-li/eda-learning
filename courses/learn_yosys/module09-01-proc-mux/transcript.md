# proc_mux algorithm

**Module id:** module09-01-proc-mux
**Lab:** proc-mux
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why proc mux

Combo case and if processes become mux cells before registers appear.

## Slide 2 — The idea

GOLDEN: mux_count=1; type is dollar mux.

<!-- algorithm-walkthrough -->

## Slide 3 — Combo process

![Combo process](assets/steps/01-start.png)

Case on s assigns y from a or b.

## Slide 4 — Emit $mux

![Emit $mux](assets/steps/02-mux.png)

proc_mux builds one $mux.

## Slide 5 — S/A/B/Y

![S/A/B/Y](assets/steps/03-ports.png)

Sel s; A=a; B=b; Y=y.

## Slide 6 — Combo removed

![Combo removed](assets/steps/04-gone.png)

Combo process is gone.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: mux_count=1.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

Open **proc-mux**. Replace the combo process with one mux cell and Check.

## Slide 9 — Implement track

Call algo_proc_mux(); assert mux_count == 1 and the cell type is dollar mux.

## Slide 10 — Pitfalls

Leaving the combo process in place. Mapping sync processes as muxes.

## Slide 11 — Try these

From the common folder, run the algo solvers self-test, or call `algo_proc_mux` directly.

```bash
cd courses/learn_yosys/common
python3 algo_solvers.py
```

## Slide 12 — Pseudocode

Here is the check in plain steps.

```text
for each combo process with two cases:
  emit dollar mux (S,A,B,Y)
  drop that process
ok if mux_count == 1
```

## Slide 13 — Next

Next: proc_dff with async reset.
