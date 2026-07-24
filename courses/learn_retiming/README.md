# learn_retiming

[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](LICENSE)
[![Role](https://img.shields.io/badge/role-course-blue)](../../eda.md)
[![Labs](https://img.shields.io/badge/labs-9-green)](docs/MODULES.md)
[![Domain](https://img.shields.io/badge/domain-retiming-orange)](docs/MODULES.md)

**learn_retiming** is the open learning path for *Leiserson–Saxe retiming*: edge register counts, lag assignments, legal moves, and clock-period search on a tiny sequential graph.

Use Track A (`common/`) or browser labs (Track B) after module-slides media is built.

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
learn_retiming/
├── README.md · LICENSE · common/ · docs/ · scripts/ · module*/
```

Optional per module: `slides.pptx`, `slides.pdf`, `audio/`, `video.mp4` (module-slides pipeline).

## Browse or clone

```bash
cd courses/learn_retiming
python3 common/test_solvers.py -v
```

## Consume from the parent

Prerequisite: [learn_synthesis](../learn_synthesis/README.md). Next: [learn_sta](../learn_sta/README.md). Lane: [`eda.md`](../../eda.md).

## Author: publish or update

```bash
python3 courses/learn_retiming/scripts/scaffold_course.py
bash courses/learn_retiming/scripts/build_all_media.sh
python3 platform/scripts/publish_course_platform.py learn_retiming
python3 .cursor/skills/module-slides/scripts/verify_course_readme.py courses/learn_retiming --modules
```

## Two learning tracks

| Track | Where |
|-------|-------|
| **A — Implement** | `common/tiny_retime.json`, `solvers.py` — [TWO_TRACKS.md](docs/TWO_TRACKS.md) |
| **B — Browser lab** | `platform/tools/<lab-id>/` — [TWO_TRACKS.md](docs/TWO_TRACKS.md) |

## Module landings

| Key | Module | Kind |
|-----|--------|------|
| `00-00-intro` | [Welcome to retiming for EDA](module00-00-intro/README.md) | `intro` |
| `01-01-sequential-graph` | [Sequential circuit graph](module01-01-sequential-graph/README.md) | `lab` |
| `01-03-register-count` | [Edge register counts](module01-03-register-count/README.md) | `lab` |
| `02-01-path-delay` | [Zero-weight path delay](module02-01-path-delay/README.md) | `lab` |
| `02-03-forward-retime` | [Forward retiming](module02-03-forward-retime/README.md) | `lab` |
| `02-05-backward-retime` | [Backward retiming](module02-05-backward-retime/README.md) | `lab` |
| `02-07-legal-retime` | [Legal retiming](module02-07-legal-retime/README.md) | `lab` |
| `03-01-period-bound` | [Period bound / FEAS lite](module03-01-period-bound/README.md) | `lab` |
| `03-03-min-period` | [Min-period search](module03-03-min-period/README.md) | `lab` |
| `03-05-area-registers` | [Register area tradeoff](module03-05-area-registers/README.md) | `lab` |
| `05-01-offline-benchmark-compare` | [Offline benchmark compare](module05-01-offline-benchmark-compare/README.md) | `offline` |
| `99-00-wrap` | [Retiming path complete](module99-00-wrap/README.md) | `wrap` |

Full index: [docs/MODULES.md](docs/MODULES.md).

## Browser labs

- [sequential-graph](https://universal-verification-methodology.github.io/learning/tools/sequential-graph/)
- [register-count](https://universal-verification-methodology.github.io/learning/tools/register-count/)
- [path-delay](https://universal-verification-methodology.github.io/learning/tools/path-delay/)
- [forward-retime](https://universal-verification-methodology.github.io/learning/tools/forward-retime/)
- [backward-retime](https://universal-verification-methodology.github.io/learning/tools/backward-retime/)
- [legal-retime](https://universal-verification-methodology.github.io/learning/tools/legal-retime/)
- [period-bound](https://universal-verification-methodology.github.io/learning/tools/period-bound/)
- [min-period](https://universal-verification-methodology.github.io/learning/tools/min-period/)
- [area-registers](https://universal-verification-methodology.github.io/learning/tools/area-registers/)

## License

[CC BY 4.0](LICENSE)
