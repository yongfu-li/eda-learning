# learn_clock_tree

[![GitHub](https://img.shields.io/badge/github-learning-monorepo-blank)](https://github.com/universal-verification-methodology)
[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](LICENSE)
[![Role](https://img.shields.io/badge/role-course-blue)](../../eda.md)
[![Parent](https://img.shields.io/badge/parent-eda__learning-informational)](../../README.md)
[![Labs](https://img.shields.io/badge/labs-platform%20tools-success)](https://universal-verification-methodology.github.io/learning/tools/)
[![Domain](https://img.shields.io/badge/domain-clock--tree-orange)](docs/MODULES.md)

**learn_clock_tree** is the open learning path for *clock tree synthesis* — H-tree / MMM, skew and latency bounds, and clock buffering on a tiny chip.

Readers follow module READMEs. Authors rebuild clips with module-slides. This tree may be consumed from the parent monorepo or as a submodule later.

## Table of contents

- [Contents](#contents)
- [Browse or clone](#browse-or-clone)
- [Consume from the parent](#consume-from-the-parent)
- [Author: publish or update](#author-publish-or-update)
- [Two learning tracks](#two-learning-tracks)
- [Module landings](#module-landings)
- [Browser labs](#browser-labs)
- [License](#license)

## Contents

```
learn_clock_tree/
├── README.md
├── LICENSE
├── common/         # Track A: tiny_cts.json, solvers, tests
├── docs/           # MODULES, SCOPE, TWO_TRACKS, WALKTHROUGHS
├── scripts/        # scaffold_course.py, build_all_media.sh, …
└── moduleSS-AA-slug/
    ├── README.md · CHECKLIST.md · EXAMPLES.md
    ├── transcript.md · outline.yaml · quiz.json
    └── (optional) examples/ · assets/ · slides · audio · video
```

Optional per-module media (pptx/pdf/audio/video) is produced by [module-slides](../../.cursor/skills/module-slides/SKILL.md).

## Browse or clone

From the monorepo root:

```bash
cd courses/learn_clock_tree
```

## Consume from the parent

Prereq: [learn_placement](../learn_placement/README.md) / [learn_sta](../learn_sta/README.md) literacy.  
Next: [learn_buffering](../learn_buffering/README.md).  
Lane map: [`eda.md`](../../eda.md). Scope: [docs/SCOPE.md](docs/SCOPE.md).

## Author: publish or update

```bash
# WSL / Linux — from monorepo root
python3 courses/learn_clock_tree/scripts/scaffold_course.py
bash courses/learn_clock_tree/scripts/build_all_media.sh
python3 platform/scripts/publish_course_platform.py learn_clock_tree
python3 .cursor/skills/module-slides/scripts/verify_course_readme.py \
  courses/learn_clock_tree --modules
```

## Two learning tracks

| Track | Where | Doc |
|-------|-------|-----|
| **A — Implement** | `common/` + `examples/` | [TWO_TRACKS.md](docs/TWO_TRACKS.md) |
| **B — Browser lab** | platform tools | [TWO_TRACKS.md](docs/TWO_TRACKS.md) |

## Module landings

Full table: [docs/MODULES.md](docs/MODULES.md).

| Key | Module | Kind |
|-----|--------|------|
| `00-00-intro` | [Welcome to clock tree synthesis](module00-00-intro/README.md) | `intro` |
| `01-01-clock-sinks` | [Clock sinks from placement](module01-01-clock-sinks/README.md) | `lab` |
| `01-03-latency-skew` | [Latency and skew](module01-03-latency-skew/README.md) | `lab` |
| `02-01-h-tree` | [H-tree topology](module02-01-h-tree/README.md) | `lab` |
| `02-03-mmm-tree` | [Method of Means and Medians](module02-03-mmm-tree/README.md) | `lab` |
| `02-05-zero-skew-merge` | [Zero-skew merge (DME lite)](module02-05-zero-skew-merge/README.md) | `lab` |
| `02-07-tapping-points` | [Tapping / branch points](module02-07-tapping-points/README.md) | `lab` |
| `03-01-clock-buffering` | [Clock buffering on wires](module03-01-clock-buffering/README.md) | `lab` |
| `03-03-skew-bound` | [Skew bound with buffers](module03-03-skew-bound/README.md) | `lab` |
| `04-01-sequential-cts` | [Sequential CTS pass](module04-01-sequential-cts/README.md) | `lab` |
| `05-01-offline-benchmark-compare` | [Offline benchmark compare](module05-01-offline-benchmark-compare/README.md) | `offline` |
| `99-00-wrap` | [Clock tree path complete](module99-00-wrap/README.md) | `wrap` |

## Browser labs

- [clock-sinks](https://universal-verification-methodology.github.io/learning/tools/clock-sinks/)
- [latency-skew](https://universal-verification-methodology.github.io/learning/tools/latency-skew/)
- [h-tree](https://universal-verification-methodology.github.io/learning/tools/h-tree/)
- [mmm-tree](https://universal-verification-methodology.github.io/learning/tools/mmm-tree/)
- [zero-skew-merge](https://universal-verification-methodology.github.io/learning/tools/zero-skew-merge/)
- [tapping-points](https://universal-verification-methodology.github.io/learning/tools/tapping-points/)
- [clock-buffering](https://universal-verification-methodology.github.io/learning/tools/clock-buffering/)
- [skew-bound](https://universal-verification-methodology.github.io/learning/tools/skew-bound/)
- [sequential-cts](https://universal-verification-methodology.github.io/learning/tools/sequential-cts/)

## License

[CC BY 4.0](LICENSE) unless noted.
