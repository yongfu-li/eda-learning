# Module 02-03-rewrite-local: Local AIG rewrite

**Module id:** `module02-03-rewrite-local`  
**Kind:** `lab` · Primary lab: `rewrite-local` · **ref**

[← Strash](../module02-01-aig-strash/README.md) · [Course README](../README.md) · [Cuts →](../module02-05-cut-enumeration/README.md)

## Outcomes

After this module you can: **Detect rewrite opportunities (complements, AND children) and both-comp → NOR mapping hints.**

## Two tracks (pick one or both)

### Track A — Implement (hands-on)

1. Open [EXAMPLES.md](EXAMPLES.md); implement **local AIG rewrite / inverter push lite** on `examples/tiny_synth.json`.
2. Complete [CHECKLIST.md](CHECKLIST.md).
3. Optional: `./scripts/module.sh 02-03-rewrite-local --check`

### Track B — Browser lab (online)

1. Local: http://127.0.0.1:8080/tools/rewrite-local/
2. Live: https://universal-verification-methodology.github.io/learning/tools/rewrite-local/
3. Load the starter AIG, run tools, Check challenges.

> Concept labs teach synthesis literacy — not production ABC/Yosys.

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
module02-03-rewrite-local/
├── README.md · CHECKLIST.md · EXAMPLES.md
├── outline.yaml · transcript.md · quiz.json
└── (optional) examples/ · assets/
```
