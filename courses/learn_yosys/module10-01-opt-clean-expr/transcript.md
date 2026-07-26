# opt_clean + opt_expr

**Module id:** module10-01-opt-clean-expr
**Lab:** opt-clean-expr
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why opt clean

Dead logic and constant buffers waste cells; clean and fold shrink the netlist.

## Slide 2 — The idea

GOLDEN: opt_clean removed=2; opt_expr folded=1.

<!-- algorithm-walkthrough -->

## Slide 3 — Dead cells

![Dead cells](assets/steps/01-scan.png)

OR to dead and BUF const0.

## Slide 4 — opt_clean

![opt_clean](assets/steps/02-clean.png)

Remove 2 unused cells.

## Slide 5 — opt_expr

![opt_expr](assets/steps/03-expr.png)

Fold const0 BUF.

## Slide 6 — Keep live

![Keep live](assets/steps/04-keep.png)

Mux/DFF/ANDs that fan out stay.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: removed=2 folded=1.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

Open **opt-clean-expr**. Remove dead cells and fold the const0 buffer.

## Slide 9 — Implement track

Call algo_opt_clean(); assert removed_count == 2. Call algo_opt_expr(); assert folded_count == 1.

## Slide 10 — Pitfalls

Deleting live fanout. Counting fold after clean already dropped the buffer.

## Slide 11 — Try these

From the common folder, run the algo solvers self-test, or call `algo_opt_clean` directly.

```bash
cd courses/learn_yosys/common
python3 algo_solvers.py
```

## Slide 12 — Pseudocode

Here is the check in plain steps.

```text
mark used nets from POs backward
drop cells whose Y/Q never used (keep mux/dff)
fold dollar buf tied to const0
ok if removed==2 and folded==1
```

## Slide 13 — Next

Next: opt_merge of duplicate ANDs.
