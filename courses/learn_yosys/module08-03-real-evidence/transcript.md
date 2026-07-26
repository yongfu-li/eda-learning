# Real Yosys evidence engine

**Module id:** module08-03-real-evidence
**Lab:** real-evidence
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why real

The evidence engine checks CLI order, RTLIL goldens, proc/flatten/opt, and synth outputs together.

## Slide 2 — The idea

GOLDEN: engine ok=True; after_synth_cells=2.

<!-- algorithm-walkthrough -->

## Slide 3 — Full recipe

![Full recipe](assets/steps/01-recipe.png)

read→hierarchy→proc→flatten→opt→synth→stat→write.

## Slide 4 — RTLIL checks

![RTLIL checks](assets/steps/02-rtlil.png)

modules/processes/$and goldens hold.

## Slide 5 — proc+flatten

![proc+flatten](assets/steps/03-mid.png)

dff created; flatten cells=4.

## Slide 6 — synth out

![synth out](assets/steps/04-synth.png)

$_AOI3_ + $_DFF_P_.

## Slide 7 — OK

![OK](assets/steps/05-ok.png)

GOLDEN: engine_ok=True.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

Open **real-evidence**. Open **real-evidence**. Build golden recipe; run Engine; confirm ok.

## Slide 9 — Implement track

Call real_yosys_engine(); assert ok.

## Slide 10 — Pitfalls

Stopping at toy yosys_engine. Wrong recipe order.

## Slide 11 — Try these

```bash
cd courses/learn_yosys/common
python3 -c "from real_solvers import real_yosys_engine; print(real_yosys_engine())"
```

## Slide 12 — Pseudocode

```text
engine ← all real checks; ok ← recipe and stage goldens match
```

## Slide 13 — Next

Next: offline compare, then wrap.
