# Module 02-07-legal-retime: Legal retiming

**Module id:** `module02-07-legal-retime`  
**Kind:** `lab` · Primary lab: `legal-retime` · **ref**

[← Backward](../module02-05-backward-retime/README.md) · [Course README](../README.md) · [FEAS lite →](../module03-01-period-bound/README.md)

## Outcomes

After this module you can: **Verify is_legal: all retimed edge weights w_r ≥ 0; forward on a passes; backward on c fails.**

## Two tracks (pick one or both)

### Track A — Implement (hands-on)

1. Open [EXAMPLES.md](EXAMPLES.md); implement **legal retiming predicate** on `examples/tiny_retime.json`.
2. Complete [CHECKLIST.md](CHECKLIST.md).
3. Optional: `./scripts/module.sh 02-07-legal-retime --check`

### Track B — Browser lab (online)

1. Local: http://127.0.0.1:8080/tools/legal-retime/
2. Live: https://universal-verification-methodology.github.io/learning/tools/legal-retime/
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
module02-07-legal-retime/
├── README.md · CHECKLIST.md · EXAMPLES.md
├── outline.yaml · transcript.md · slides.md · quiz.json
└── (optional) examples/ · assets/
```
