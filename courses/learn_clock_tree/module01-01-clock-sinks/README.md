# Module 01-01-clock-sinks: Clock sinks from placement

**Module id:** `module01-01-clock-sinks`  
**Kind:** `lab` · Primary lab: `clock-sinks` · **ref**

[← Welcome](../module00-00-intro/README.md) · [Course README](../README.md) · [Latency skew →](../module01-03-latency-skew/README.md)

## Outcomes

After this module you can: **Map placement centers to clock sinks and locate the chip-center source.**

## Two tracks (pick one or both)

### Track A — Implement (hands-on)

1. Open [EXAMPLES.md](EXAMPLES.md) and implement **clock sink enumeration from placement** on `examples/tiny_cts.json`.
2. Complete [CHECKLIST.md](CHECKLIST.md) with latency and skew when relevant.
3. Optional self-check: `./scripts/module.sh 01-01-clock-sinks --check` (from course root).

### Track B — Browser lab (online)

1. Local: [http://127.0.0.1:8080/tools/clock-sinks/](http://127.0.0.1:8080/tools/clock-sinks/)
2. Live: [https://universal-verification-methodology.github.io/learning/tools/clock-sinks/](https://universal-verification-methodology.github.io/learning/tools/clock-sinks/)
3. Tools shelf: open `clock-sinks` from the platform tools index
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
module01-01-clock-sinks/
├── README.md
├── CHECKLIST.md
├── EXAMPLES.md
├── outline.yaml
├── transcript.md
├── quiz.json
└── (optional) examples/ · assets/
```
