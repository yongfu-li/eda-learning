# memory_map algorithm

**Module id:** module12-01-memory-map-algo
**Lab:** memory-map-algo
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why memory

Memory passes turn array descriptions into dollar-mem cells with size and width.

## Slide 2 — The idea

GOLDEN: one dollar mem; depth=8; width=4.

<!-- algorithm-walkthrough -->

## Slide 3 — Array

![Array](assets/steps/01-arr.png)

Width 4 depth 8.

## Slide 4 — Infer

![Infer](assets/steps/02-infer.png)

memory_* → $mem.

## Slide 5 — Ports

![Ports](assets/steps/03-ports.png)

Read and write ports counted.

## Slide 6 — SIZE

![SIZE](assets/steps/04-size.png)

SIZE=depth=8.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: depth=8 width=4.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

Open **memory-map-algo**. Build the mem cell and Check depth and width.

## Slide 9 — Implement track

Call algo_memory_map(); assert depth == 8 and width == 4.

## Slide 10 — Pitfalls

Swapping depth and width. Ignoring read versus write ports.

## Slide 11 — Try these

From the common folder, run the algo solvers self-test, or call `algo_memory_map` directly.

```bash
cd courses/learn_yosys/common
python3 algo_solvers.py
```

## Slide 12 — Pseudocode

Here is the check in plain steps.

```text
read memory block from tiny_algo
emit dollar mem WIDTH=width SIZE=depth
ok if depth==8 and width==4
```

## Slide 13 — Next

Next: FSM detect and encoding bits.
