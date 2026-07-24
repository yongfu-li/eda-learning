# learn_buffering

[![GitHub](https://img.shields.io/badge/github-learning-monorepo-blank)](https://github.com/universal-verification-methodology)
[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](LICENSE)
[![Role](https://img.shields.io/badge/role-course-blue)](../../eda.md)
[![Parent](https://img.shields.io/badge/parent-eda__learning-informational)](../../README.md)
[![Labs](https://img.shields.io/badge/labs-platform%20tools-success)](https://universal-verification-methodology.github.io/learning/tools/)
[![Domain](https://img.shields.io/badge/domain-buffering-orange)](docs/MODULES.md)

**learn_buffering** is the open learning path for *Van Ginneken-style and slew-driven buffer insertion* on a tiny routed net.

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
learn_buffering/
├── README.md · LICENSE
├── common/         # tiny_buf.json, solvers, tests
├── docs/           # MODULES, SCOPE, TWO_TRACKS, WALKTHROUGHS
├── scripts/
└── moduleSS-AA-slug/
```

## Browse or clone

```bash
cd courses/learn_buffering
```

## Consume from the parent

Prereq: [learn_clock_tree](../learn_clock_tree/README.md).  
Next: [learn_signoff](../learn_signoff/README.md) or deepen [learn_sta](../learn_sta/README.md).  
Lane map: [`eda.md`](../../eda.md).

## Author: publish or update

```bash
python3 courses/learn_buffering/scripts/scaffold_course.py
bash courses/learn_buffering/scripts/build_all_media.sh
python3 platform/scripts/publish_course_platform.py learn_buffering
python3 .cursor/skills/module-slides/scripts/verify_course_readme.py \
  courses/learn_buffering --modules
```

## Two learning tracks

| Track | Where | Doc |
|-------|-------|-----|
| **A — Implement** | `common/` | [TWO_TRACKS.md](docs/TWO_TRACKS.md) |
| **B — Browser lab** | platform tools | [TWO_TRACKS.md](docs/TWO_TRACKS.md) |

## Module landings

Full table: [docs/MODULES.md](docs/MODULES.md).

| Key | Module | Kind |
|-----|--------|------|
| `00-00-intro` | [Welcome to buffer insertion for EDA](module00-00-intro/README.md) | `intro` |
| `01-01-wire-rc` | [Wire R/C model](module01-01-wire-rc/README.md) | `lab` |
| `01-03-slew-budget` | [Slew / transition budget](module01-03-slew-budget/README.md) | `lab` |
| `02-01-candidate-sites` | [Buffer candidate sites](module02-01-candidate-sites/README.md) | `lab` |
| `02-03-buffer-library` | [Buffer library options](module02-03-buffer-library/README.md) | `lab` |
| `02-05-van-ginneken` | [Van Ginneken DP lite](module02-05-van-ginneken/README.md) | `lab` |
| `02-07-slew-driven` | [Slew-driven insertion](module02-07-slew-driven/README.md) | `lab` |
| `03-01-polarity-invert` | [Polarity / inverter pairs](module03-01-polarity-invert/README.md) | `lab` |
| `03-03-fanout-tree` | [Fanout buffer tree](module03-03-fanout-tree/README.md) | `lab` |
| `04-01-sequential-buffer` | [Sequential buffering pass](module04-01-sequential-buffer/README.md) | `lab` |
| `05-01-offline-benchmark-compare` | [Offline benchmark compare](module05-01-offline-benchmark-compare/README.md) | `offline` |
| `99-00-wrap` | [Buffering path complete](module99-00-wrap/README.md) | `wrap` |

## Browser labs

- [wire-rc](https://universal-verification-methodology.github.io/learning/tools/wire-rc/)
- [slew-budget](https://universal-verification-methodology.github.io/learning/tools/slew-budget/)
- [candidate-sites](https://universal-verification-methodology.github.io/learning/tools/candidate-sites/)
- [buffer-library](https://universal-verification-methodology.github.io/learning/tools/buffer-library/)
- [van-ginneken](https://universal-verification-methodology.github.io/learning/tools/van-ginneken/)
- [slew-driven](https://universal-verification-methodology.github.io/learning/tools/slew-driven/)
- [polarity-invert](https://universal-verification-methodology.github.io/learning/tools/polarity-invert/)
- [fanout-tree](https://universal-verification-methodology.github.io/learning/tools/fanout-tree/)
- [sequential-buffer](https://universal-verification-methodology.github.io/learning/tools/sequential-buffer/)

## License

[CC BY 4.0](LICENSE) unless noted.
