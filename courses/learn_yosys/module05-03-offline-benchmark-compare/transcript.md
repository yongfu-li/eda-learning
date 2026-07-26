# Offline benchmark compare

**Module id:** module05-03-offline-benchmark-compare
**Lab:** offline-benchmark-compare
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why offline compare

Print pass-map and real Yosys compare metrics without the browser.

## Slide 2 — Pass-map compare

Run the pass-map compare helper from the common folder.

```bash
cd courses/learn_yosys/common
python3 -c "from solvers import yosys_compare; print(yosys_compare())"
```

## Slide 3 — Real compare

Run the real evidence compare helper.

```bash
cd courses/learn_yosys/common
python3 -c "from real_solvers import real_yosys_compare; print(real_yosys_compare())"
```

## Slide 4 — Browser lab track

Open offline-benchmark-compare if you prefer the browser view of the same metrics.

## Slide 5 — Implement track

Confirm both compare helpers print ok goldens from the common folder.

## Slide 6 — Pitfalls

Comparing only one track. Ignoring checked-in goldens when Yosys is missing.

## Slide 7 — Next

Continue into the real CLI modules, then Part C algorithms.
