# Yosys algo engine

**Module id:** module13-03-yosys-algo-engine
**Lab:** yosys-algo-engine
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why engine

One engine call chains proc, opt, techmap, extract, memory, fsm, and abc goldens.

## Slide 2 — The idea

GOLDEN: yosys_algo_engine ok=True (all Part C goldens).

<!-- algorithm-walkthrough -->

## Slide 3 — All checks

![All checks](assets/steps/01-all.png)

Engine runs every Part C pass.

## Slide 4 — proc goldens

![proc goldens](assets/steps/02-proc.png)

mux=1 dff=1.

## Slide 5 — opt goldens

![opt goldens](assets/steps/03-opt.png)

clean 2 merge ands=1.

## Slide 6 — map goldens

![map goldens](assets/steps/04-map.png)

techmap 2 extract 1.

## Slide 7 — OK

![OK](assets/steps/05-ok.png)

GOLDEN: engine ok=True.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

Open **yosys-algo-engine**. Run the full chain and Check ok.

## Slide 9 — Implement track

Call yosys_algo_engine(); assert ok is True.

## Slide 10 — Pitfalls

Passing a mutated design mid-chain. Asserting only one stage and calling it done.

## Slide 11 — Try these

From the common folder, run the algo solvers self-test, or call `yosys_algo_engine` directly.

```bash
cd courses/learn_yosys/common
python3 algo_solvers.py
```

## Slide 12 — Pseudocode

Here is the check in plain steps.

```text
run mux, dff, clean, expr, merge, techmap, extract, memory, fsm, abc
ok if every golden matches
```

## Slide 13 — Next

Next: offline benchmark compare.
