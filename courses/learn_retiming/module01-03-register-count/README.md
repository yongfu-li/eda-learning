# Module 01-03-register-count: Edge register counts

**Module id:** `module01-03-register-count`  
**Kind:** `lab` · Primary lab: `register-count` · **ref**

[← Seq graph](../module01-01-sequential-graph/README.md) · [Course README](../README.md) · [Path delay →](../module02-01-path-delay/README.md)

## Outcomes

After this module you can: **Sum edge weights w as register count; locate e0 and e2 as the two baseline registers.**

## Two tracks (pick one or both)

### Track A — Implement (hands-on)

1. Open [EXAMPLES.md](EXAMPLES.md); implement **edge register count w on sequential edges** on `examples/tiny_retime.json`.
2. Complete [CHECKLIST.md](CHECKLIST.md).
3. Optional: `./scripts/module.sh 01-03-register-count --check`

### Track B — Browser lab (online)

1. Local: http://127.0.0.1:8080/tools/register-count/
2. Live: https://universal-verification-methodology.github.io/learning/tools/register-count/
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
module01-03-register-count/
├── README.md · CHECKLIST.md · EXAMPLES.md
├── outline.yaml · transcript.md · slides.md · quiz.json
└── (optional) examples/ · assets/
```
