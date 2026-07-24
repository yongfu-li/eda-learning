# Module 02-07-slew-driven: Slew-driven insertion

**Module id:** `module02-07-slew-driven`  
**Kind:** `lab` · Primary lab: `slew-driven` · **ref**

[← Van Ginneken](../module02-05-van-ginneken/README.md) · [Course README](../README.md) · [Polarity →](../module03-01-polarity-invert/README.md)

## Outcomes

After this module you can: **Greedily insert buffers on edges whose estimated slew exceeds the limit.**

## Two tracks (pick one or both)

### Track A — Implement (hands-on)

1. Open [EXAMPLES.md](EXAMPLES.md) and implement **slew-driven greedy buffer insertion** on `examples/tiny_buf.json`.
2. Complete [CHECKLIST.md](CHECKLIST.md).
3. Optional: `./scripts/module.sh 02-07-slew-driven --check`

### Track B — Browser lab (online)

1. Local: [http://127.0.0.1:8080/tools/slew-driven/](http://127.0.0.1:8080/tools/slew-driven/)
2. Live: [https://universal-verification-methodology.github.io/learning/tools/slew-driven/](https://universal-verification-methodology.github.io/learning/tools/slew-driven/)
3. Load the starter buffering net, run the tool, Check challenges.

> Concept labs teach buffering literacy — not production timing closure.

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
module02-07-slew-driven/
├── README.md · CHECKLIST.md · EXAMPLES.md
├── outline.yaml · transcript.md · quiz.json
└── (optional) examples/ · assets/
```
