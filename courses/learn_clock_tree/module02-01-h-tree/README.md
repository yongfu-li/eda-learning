# Module 02-01-h-tree: H-tree topology

**Module id:** `module02-01-h-tree`  
**Kind:** `lab` · Primary lab: `h-tree` · **ref**

[← Latency skew](../module01-03-latency-skew/README.md) · [Course README](../README.md) · [MMM tree →](../module02-03-mmm-tree/README.md)

## Outcomes

After this module you can: **Build a recursive H-tree from the source covering sink clusters.**

## Two tracks (pick one or both)

### Track A — Implement (hands-on)

1. Open [EXAMPLES.md](EXAMPLES.md) and implement **H-tree clock topology** on `examples/tiny_cts.json`.
2. Complete [CHECKLIST.md](CHECKLIST.md) with latency and skew when relevant.
3. Optional self-check: `./scripts/module.sh 02-01-h-tree --check` (from course root).

### Track B — Browser lab (online)

1. Local: [http://127.0.0.1:8080/tools/h-tree/](http://127.0.0.1:8080/tools/h-tree/)
2. Live: [https://universal-verification-methodology.github.io/learning/tools/h-tree/](https://universal-verification-methodology.github.io/learning/tools/h-tree/)
3. Tools shelf: open `h-tree` from the platform tools index
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
module02-01-h-tree/
├── README.md
├── CHECKLIST.md
├── EXAMPLES.md
├── outline.yaml
├── transcript.md
├── quiz.json
└── (optional) examples/ · assets/
```
