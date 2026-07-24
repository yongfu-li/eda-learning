# Module 03-01-period-bound: Period bound / FEAS lite

**Module id:** `module03-01-period-bound`  
**Kind:** `lab` · Primary lab: `period-bound` · **P**

[← Legal](../module02-07-legal-retime/README.md) · [Course README](../README.md) · [Min period →](../module03-03-min-period/README.md)

## Outcomes

After this module you can: **Use feas_check: legal r and clock_period ≤ target (5); forward on a meets target from baseline 8.**

## Two tracks (pick one or both)

### Track A — Implement (hands-on)

1. Open [EXAMPLES.md](EXAMPLES.md); implement **FEAS lite period feasibility check** on `examples/tiny_retime.json`.
2. Complete [CHECKLIST.md](CHECKLIST.md).
3. Optional: `./scripts/module.sh 03-01-period-bound --check`

### Track B — Browser lab (online)

1. Local: http://127.0.0.1:8080/tools/period-bound/
2. Live: https://universal-verification-methodology.github.io/learning/tools/period-bound/
3. Load the starter graph, apply retiming moves, Check challenges.

> Concept labs teach retiming literacy — not production OpenROAD/ABC retime.

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
module03-01-period-bound/
├── README.md · CHECKLIST.md · EXAMPLES.md
├── outline.yaml · transcript.md · slides.md · quiz.json
└── (optional) examples/ · assets/
```
