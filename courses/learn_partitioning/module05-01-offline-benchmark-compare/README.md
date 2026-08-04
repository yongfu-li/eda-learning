# Offline benchmark compare

**Module id:** `module05-01-offline-benchmark-compare`  
**Kind:** `lab` · Platform: [`Benchmarks → Partitioning`](../../../platform/benchmarks/partitioning/) · Optional external compare · **Shipped**

[← Multilevel](../module04-01-multilevel-partition/README.md) · [Course README](../README.md) · [Wrap →](../module99-00-wrap/README.md)

## Outcomes

After this module you can: **Compare partitioners (built-in and uploaded) on shared instances by runtime, memory, cutsize, and balance — and optionally check an open external tool against the same I/O.**

## Benchmarks page (primary)

1. Open [Benchmarks → Partitioning](../../../platform/benchmarks/partitioning/).
2. Run selective tiny (or dataset average); read **Runtime** and **Memory** first.
3. Optionally **upload** a JS module exporting `partition(graph, opts)` — it appears above the built-in list.
4. Switch to medium / average mode and compare again.

## Offline stretch (optional)

1. Follow [EXAMPLES.md](EXAMPLES.md) to export the same graph and run KaHyPar / Metis-style flow when available.
2. Record cutsize / balance / runtime / memory in a comparison table.
3. Complete [CHECKLIST.md](CHECKLIST.md).

## Media

| Artifact | Path |
|----------|------|
| Transcript | [transcript.md](transcript.md) |
| Outline | [outline.yaml](outline.yaml) |
| Slides | [slides.pptx](slides.pptx) · [slides.pdf](slides.pdf) |
| Video | [video.mp4](video.mp4) |
| Quiz | [quiz.json](quiz.json) |

## Files

```
module05-01-offline-benchmark-compare/
├── README.md
├── CHECKLIST.md
├── EXAMPLES.md
├── outline.yaml
├── transcript.md
├── quiz.json
└── (optional) examples/ · assets/
```
