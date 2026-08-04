# Checklist — Offline benchmark compare

## Platform scoreboard (runtime · memory)

- [ ] Opened **Benchmarks → Partitioning** (not a Tools lab)
- [ ] Selective tiny: every row has runtime (ms) and memory
- [ ] Read the Runtime vs memory scatter
- [ ] Dataset average over tiny + medium (ms shows min–max)
- [ ] Uploaded (or loaded example) solver appears **above** builtins
- [ ] Still checked cut/balance — quality is not ignored

## Fair-compare hygiene

- [ ] Same instance set for every algo in a run
- [ ] Fixed random seed when comparing random / seeded refiners
- [ ] Knew whether memory was heap-delta or structural estimate (*)

## Optional external tool

- [ ] Exported `common/tiny_graph.json` or `common/medium_graph.json`
- [ ] Ran an open partitioner (KaHyPar / Metis-style) **or** documented the install gap
- [ ] Filled a short comparison table (quality / balance / runtime / memory / notes)
