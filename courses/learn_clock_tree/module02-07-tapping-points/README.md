# Module 02-07-tapping-points: Tapping / branch points

**Module id:** `module02-07-tapping-points`  
**Kind:** `lab` · Primary lab: `tapping-points` · **ref**

[← Zero-skew](../module02-05-zero-skew-merge/README.md) · [Course README](../README.md) · [Buffering →](../module03-01-clock-buffering/README.md)

## Outcomes

After this module you can: **Identify high-degree steiner taps where the clock network branches.**

## Two tracks (pick one or both)

### Track A — Implement (hands-on)

1. Open [EXAMPLES.md](EXAMPLES.md) and implement **clock tapping / branch-point extraction** on `examples/tiny_cts.json`.
2. Complete [CHECKLIST.md](CHECKLIST.md) with latency and skew when relevant.
3. Optional self-check: `./scripts/module.sh 02-07-tapping-points --check` (from course root).

### Track B — Browser lab (online)

1. Local: [http://127.0.0.1:8080/tools/tapping-points/](http://127.0.0.1:8080/tools/tapping-points/)
2. Live: [https://universal-verification-methodology.github.io/learning/tools/tapping-points/](https://universal-verification-methodology.github.io/learning/tools/tapping-points/)
3. Tools shelf: open `tapping-points` from the platform tools index
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
module02-07-tapping-points/
├── README.md
├── CHECKLIST.md
├── EXAMPLES.md
├── outline.yaml
├── transcript.md
├── quiz.json
└── (optional) examples/ · assets/
```
