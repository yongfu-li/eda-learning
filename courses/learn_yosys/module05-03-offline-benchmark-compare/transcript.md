# Offline benchmark compare

**Module id:** module05-03-offline-benchmark-compare

## Slide 1 — Offline

Print toy and real Yosys compare metrics without the browser.

## Slide 2 — Toy compare

```bash
cd courses/learn_yosys/common
python3 -c "from solvers import yosys_compare; print(yosys_compare())"
```

## Slide 3 — Real evidence

```bash
python3 -c "from real_solvers import real_yosys_compare; print(real_yosys_compare())"
```

## Slide 4 — Optional live Yosys

```bash
bash scripts/run_evidence.sh
python3 scripts/build_evidence_goldens.py
```

## Slide 5 — Expect

Real compare: ok=True, flatten_cells=4, synth_cells=2, types $_AOI3_/$_DFF_P_.

## Slide 6 — Next

Wrap — you finished the Yosys path.
