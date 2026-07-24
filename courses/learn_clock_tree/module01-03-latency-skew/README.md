# Module 01-03-latency-skew: Latency and skew

**Module id:** `module01-03-latency-skew`  
**Kind:** `lab` · Primary lab: `latency-skew` · **ref**

[← Clock sinks](../module01-01-clock-sinks/README.md) · [Course README](../README.md) · [H-tree →](../module02-01-h-tree/README.md)

## Outcomes

After this module you can: **Compute per-sink tree latency and skew as max minus min.**

## Two tracks (pick one or both)

### Track A — Implement (hands-on)

1. Open [EXAMPLES.md](EXAMPLES.md) and implement **clock latency and skew metrics** on `examples/tiny_cts.json`.
2. Complete [CHECKLIST.md](CHECKLIST.md) with latency and skew when relevant.
3. Optional self-check: `./scripts/module.sh 01-03-latency-skew --check` (from course root).

### Track B — Browser lab (online)

1. Local: [http://127.0.0.1:8080/tools/latency-skew/](http://127.0.0.1:8080/tools/latency-skew/)
2. Live: [https://universal-verification-methodology.github.io/learning/tools/latency-skew/](https://universal-verification-methodology.github.io/learning/tools/latency-skew/)
3. Tools shelf: open `latency-skew` from the platform tools index
4. Load the **starter clock tree** instance, build a tree, inspect skew and buffers.
5. Check off Track B items in [CHECKLIST.md](CHECKLIST.md).

> Concept labs teach CTS literacy on a tiny chip — not production clock trees.

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
module01-03-latency-skew/
├── README.md
├── CHECKLIST.md
├── EXAMPLES.md
├── outline.yaml
├── transcript.md
├── quiz.json
└── (optional) examples/ · assets/
```
