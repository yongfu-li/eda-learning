# Module 03-03-skew-bound: Skew bound with buffers

**Module id:** `module03-03-skew-bound`  
**Kind:** `lab` · Primary lab: `skew-bound` · **ref**

[← Buffering](../module03-01-clock-buffering/README.md) · [Course README](../README.md) · [Sequential CTS →](../module04-01-sequential-cts/README.md)

## Outcomes

After this module you can: **Check whether tree skew meets a numeric bound after topology/buffer choices.**

## Two tracks (pick one or both)

### Track A — Implement (hands-on)

1. Open [EXAMPLES.md](EXAMPLES.md) and implement **skew bound checking** on `examples/tiny_cts.json`.
2. Complete [CHECKLIST.md](CHECKLIST.md) with latency and skew when relevant.
3. Optional self-check: `./scripts/module.sh 03-03-skew-bound --check` (from course root).

### Track B — Browser lab (online)

1. Local: [http://127.0.0.1:8080/tools/skew-bound/](http://127.0.0.1:8080/tools/skew-bound/)
2. Live: [https://universal-verification-methodology.github.io/learning/tools/skew-bound/](https://universal-verification-methodology.github.io/learning/tools/skew-bound/)
3. Tools shelf: open `skew-bound` from the platform tools index
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
module03-03-skew-bound/
├── README.md
├── CHECKLIST.md
├── EXAMPLES.md
├── outline.yaml
├── transcript.md
├── quiz.json
└── (optional) examples/ · assets/
```
