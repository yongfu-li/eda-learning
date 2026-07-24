# Module 04-01-sequential-cts: Sequential CTS pass

**Module id:** `module04-01-sequential-cts`  
**Kind:** `lab` · Primary lab: `sequential-cts` · **ref**

[← Skew bound](../module03-03-skew-bound/README.md) · [Course README](../README.md) · [Offline →](../module05-01-offline-benchmark-compare/README.md)

## Outcomes

After this module you can: **Grow a tree by attaching sinks one-by-one to the nearest existing node.**

## Two tracks (pick one or both)

### Track A — Implement (hands-on)

1. Open [EXAMPLES.md](EXAMPLES.md) and implement **sequential / order-based CTS** on `examples/tiny_cts.json`.
2. Complete [CHECKLIST.md](CHECKLIST.md) with latency and skew when relevant.
3. Optional self-check: `./scripts/module.sh 04-01-sequential-cts --check` (from course root).

### Track B — Browser lab (online)

1. Local: [http://127.0.0.1:8080/tools/sequential-cts/](http://127.0.0.1:8080/tools/sequential-cts/)
2. Live: [https://universal-verification-methodology.github.io/learning/tools/sequential-cts/](https://universal-verification-methodology.github.io/learning/tools/sequential-cts/)
3. Tools shelf: open `sequential-cts` from the platform tools index
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
module04-01-sequential-cts/
├── README.md
├── CHECKLIST.md
├── EXAMPLES.md
├── outline.yaml
├── transcript.md
├── quiz.json
└── (optional) examples/ · assets/
```
