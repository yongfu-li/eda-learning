# proc_dff + async reset

**Module id:** module09-03-proc-dff-arst
**Lab:** proc-dff-arst
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why proc dff

Sync processes become flip-flops; async reset rides on the ARST ports.

## Slide 2 — The idea

GOLDEN: one dollar adff with arst; processes left = 0. Real Yosys binds the same.

<!-- algorithm-walkthrough -->

## Slide 3 — Sync process

![Sync process](assets/steps/01-sync.png)

Posedge clk with async reset.

## Slide 4 — Emit $adff

![Emit $adff](assets/steps/02-dff.png)

Real Yosys emits $adff when async reset is present.

## Slide 5 — ARST port

![ARST port](assets/steps/03-arst.png)

Reset becomes ARST on the $adff.

## Slide 6 — Processes=0

![Processes=0](assets/steps/04-done.png)

All processes lowered.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: type=$adff has_arst=True.

<!-- /algorithm-walkthrough -->



## Slide 8 — Browser lab track

Open **proc-dff-arst**. Emit the $adff with reset ports, clear all processes, and confirm the real bind.

## Slide 9 — Implement track

Call algo_proc_dff(); assert reg_type is $adff, has_arst is True, processes == 0. Then run partc_bind.py.

## Slide 10 — Pitfalls

Emitting plain $dff when async reset is present. Stopping before processes reach zero.

## Slide 11 — Try these

From the common folder, run the algo solvers self-test, or call `algo_proc_dff` and `partc_bind` directly.

```bash
cd courses/learn_yosys/common
python3 algo_solvers.py
python3 partc_bind.py
```

## Slide 12 — Pseudocode

Here is the check in plain steps.

```text
run proc_mux first
for each sync process:
  if reset present: emit $adff (CLK,D,Q,ARST)
  else: emit $dff (CLK,D,Q)
ok if reg_type==$adff and processes==0
```

## Slide 13 — Next

Next: opt_clean and opt_expr goldens.
